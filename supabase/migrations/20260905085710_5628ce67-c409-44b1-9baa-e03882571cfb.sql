
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users ON DELETE CASCADE,
  full_name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.profiles TO authenticated;
GRANT ALL ON public.profiles TO service_role;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own profile" ON public.profiles FOR ALL TO authenticated USING (auth.uid() = id) WITH CHECK (auth.uid() = id);

CREATE TABLE public.portfolios (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users ON DELETE CASCADE,
  name TEXT NOT NULL,
  total_value NUMERIC NOT NULL DEFAULT 0,
  risk_score NUMERIC NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.portfolios TO authenticated;
GRANT ALL ON public.portfolios TO service_role;
ALTER TABLE public.portfolios ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own portfolios" ON public.portfolios FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE TABLE public.allocations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users ON DELETE CASCADE,
  portfolio_id UUID NOT NULL REFERENCES public.portfolios ON DELETE CASCADE,
  asset_class TEXT NOT NULL,
  target_weight NUMERIC NOT NULL DEFAULT 0,
  current_weight NUMERIC NOT NULL DEFAULT 0,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.allocations TO authenticated;
GRANT ALL ON public.allocations TO service_role;
ALTER TABLE public.allocations ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own allocations" ON public.allocations FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE TABLE public.risk_alerts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users ON DELETE CASCADE,
  portfolio_id UUID REFERENCES public.portfolios ON DELETE CASCADE,
  severity TEXT NOT NULL DEFAULT 'ok',
  title TEXT NOT NULL,
  message TEXT,
  action_taken TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.risk_alerts TO authenticated;
GRANT ALL ON public.risk_alerts TO service_role;
ALTER TABLE public.risk_alerts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own alerts" ON public.risk_alerts FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE TABLE public.scenarios (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users ON DELETE CASCADE,
  portfolio_id UUID REFERENCES public.portfolios ON DELETE CASCADE,
  name TEXT NOT NULL,
  shock_asset_class TEXT NOT NULL,
  shock_pct NUMERIC NOT NULL,
  result JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.scenarios TO authenticated;
GRANT ALL ON public.scenarios TO service_role;
ALTER TABLE public.scenarios ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own scenarios" ON public.scenarios FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  pid UUID;
BEGIN
  INSERT INTO public.profiles (id, full_name, avatar_url)
  VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1)), NEW.raw_user_meta_data->>'avatar_url')
  ON CONFLICT (id) DO NOTHING;

  INSERT INTO public.portfolios (user_id, name, total_value, risk_score)
  VALUES (NEW.id, 'Core Balance Sheet', 48250000, 62)
  RETURNING id INTO pid;

  INSERT INTO public.allocations (user_id, portfolio_id, asset_class, target_weight, current_weight) VALUES
    (NEW.id, pid, 'Equities', 35, 38.4),
    (NEW.id, pid, 'Fixed Income', 30, 27.1),
    (NEW.id, pid, 'Credit', 15, 14.2),
    (NEW.id, pid, 'Cash & Liquidity', 12, 13.6),
    (NEW.id, pid, 'Alternatives', 8, 6.7);

  INSERT INTO public.risk_alerts (user_id, portfolio_id, severity, title, message, action_taken) VALUES
    (NEW.id, pid, 'breach', 'Equity exposure above ceiling', 'Equities drifted to 38.4% against a 36% hard ceiling.', 'Trimmed 2.4% equities into liquidity buffer'),
    (NEW.id, pid, 'warning', 'Liquidity coverage nearing floor', 'Cash buffer within 1.4% of the minimum liquidity constraint.', 'Rebalance queued for next window'),
    (NEW.id, pid, 'ok', 'Duration within tolerance', 'Fixed income duration at 4.1y, inside the 3.5-4.5y band.', 'No action required');

  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
