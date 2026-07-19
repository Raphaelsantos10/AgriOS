-- ============================================================
-- FARPHA — Universal Crop Engine v1
-- Catálogo universal de culturas e variedades (fundação)
-- Execute no Supabase SQL Editor.
-- ============================================================

create extension if not exists pgcrypto;

create table if not exists public.crop_catalog (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  common_name text not null,
  scientific_name text,
  category text not null default 'other'
    check (category in ('fruit_tree','vineyard','cereal','horticulture','forest','aromatic','other')),
  aliases text[] not null default '{}',
  recommended_regions text[] not null default '{}',
  description text,
  climate_profile jsonb not null default '{}'::jsonb,
  soil_profile jsonb not null default '{}'::jsonb,
  water_profile jsonb not null default '{}'::jsonb,
  frost_tolerance text check (frost_tolerance in ('low','medium','high')),
  heat_tolerance text check (heat_tolerance in ('low','medium','high')),
  source_type text not null default 'catalog' check (source_type in ('catalog','custom')),
  created_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists crop_catalog_common_name_idx on public.crop_catalog (common_name);
create index if not exists crop_catalog_category_idx on public.crop_catalog (category);
create index if not exists crop_catalog_regions_gin_idx on public.crop_catalog using gin (recommended_regions);
create index if not exists crop_catalog_aliases_gin_idx on public.crop_catalog using gin (aliases);

alter table public.crop_catalog enable row level security;

drop policy if exists "Leitura publica crop catalog" on public.crop_catalog;
drop policy if exists "Criar crop catalog desenvolvimento" on public.crop_catalog;
drop policy if exists "Atualizar crop catalog desenvolvimento" on public.crop_catalog;

create policy "Leitura publica crop catalog" on public.crop_catalog
for select to anon, authenticated using (true);

create policy "Criar crop catalog desenvolvimento" on public.crop_catalog
for insert to anon, authenticated with check (true);

create policy "Atualizar crop catalog desenvolvimento" on public.crop_catalog
for update to anon, authenticated using (true) with check (true);

grant select, insert, update on public.crop_catalog to anon, authenticated;

insert into public.crop_catalog (
  slug, common_name, scientific_name, category, aliases, recommended_regions,
  description, climate_profile, soil_profile, water_profile,
  frost_tolerance, heat_tolerance, source_type
) values
('castanheiro','Castanheiro','Castanea sativa','fruit_tree',array['castanha','souto'],array['Portugal — Norte','Portugal — Centro'],'Fruteira de clima temperado, tradicional em soutos do Norte e Centro.',
 '{"winter_chill":{"min":700,"max":1200,"unit":"hours"},"summer":"moderate_warm"}',
 '{"ph":{"min":5.0,"max":6.5},"drainage":"good","notes":"Evitar solos calcários e encharcados."}',
 '{"need":"medium","notes":"Rega de apoio melhora instalação e produção em verões secos."}','high','medium','catalog'),
('oliveira','Oliveira','Olea europaea','fruit_tree',array['olival','azeitona'],array['Portugal — Norte','Portugal — Centro','Portugal — Lisboa e Vale do Tejo','Portugal — Alentejo','Portugal — Algarve'],'Árvore mediterrânica tolerante à seca, sensível a frio extremo em algumas variedades.',
 '{"winter_chill":{"min":200,"max":600,"unit":"hours"},"summer":"hot_dry"}',
 '{"ph":{"min":5.5,"max":8.5},"drainage":"good"}',
 '{"need":"low_medium","notes":"A rega localizada aumenta estabilidade produtiva."}','medium','high','catalog'),
('vinha','Vinha','Vitis vinifera','vineyard',array['videira','uva','vinhedo'],array['Portugal — Norte','Portugal — Centro','Portugal — Lisboa e Vale do Tejo','Portugal — Alentejo','Portugal — Algarve','Portugal — Madeira'],'Cultura com ampla adaptação; variedade, porta-enxerto e exposição são determinantes.',
 '{"winter_chill":{"min":100,"max":500,"unit":"hours"},"summer":"warm_dry"}',
 '{"ph":{"min":5.5,"max":8.0},"drainage":"good"}',
 '{"need":"medium","notes":"Necessidade depende da região, solo e objetivo enológico."}','medium','high','catalog'),
('figueira','Figueira','Ficus carica','fruit_tree',array['figo'],array['Portugal — Norte','Portugal — Centro','Portugal — Lisboa e Vale do Tejo','Portugal — Alentejo','Portugal — Algarve','Portugal — Madeira'],'Fruteira rústica e bem adaptada a verões quentes e secos.',
 '{"winter":"mild_cool","summer":"hot"}',
 '{"ph":{"min":6.0,"max":8.0},"drainage":"good"}',
 '{"need":"low_medium"}','medium','high','catalog'),
('pereira','Pereira','Pyrus communis','fruit_tree',array['pera'],array['Portugal — Norte','Portugal — Centro','Portugal — Lisboa e Vale do Tejo'],'Fruteira temperada que beneficia de horas de frio e disponibilidade de água no verão.',
 '{"winter_chill":{"min":500,"max":1200,"unit":"hours"},"summer":"moderate"}',
 '{"ph":{"min":6.0,"max":7.5},"drainage":"good"}',
 '{"need":"medium_high"}','high','medium','catalog'),
('pessegueiro','Pessegueiro','Prunus persica','fruit_tree',array['pêssego','pessegueiro'],array['Portugal — Norte','Portugal — Centro','Portugal — Lisboa e Vale do Tejo','Portugal — Alentejo'],'Fruteira de elevada exigência técnica, sensível a geada durante a floração.',
 '{"winter_chill":{"min":300,"max":1000,"unit":"hours"},"summer":"warm"}',
 '{"ph":{"min":6.0,"max":7.5},"drainage":"excellent"}',
 '{"need":"medium_high"}','medium','high','catalog'),
('laranjeira','Laranjeira','Citrus sinensis','fruit_tree',array['laranja','citrinos'],array['Portugal — Lisboa e Vale do Tejo','Portugal — Alentejo','Portugal — Algarve','Portugal — Madeira'],'Citrino sensível a geadas fortes, adequado a regiões de inverno ameno.',
 '{"winter":"mild","summer":"warm_hot"}',
 '{"ph":{"min":5.5,"max":7.5},"drainage":"good"}',
 '{"need":"high"}','low','high','catalog'),
('macieira','Macieira','Malus domestica','fruit_tree',array['maçã'],array['Portugal — Norte','Portugal — Centro'],'Fruteira temperada com variedades de diferentes necessidades de frio.',
 '{"winter_chill":{"min":500,"max":1400,"unit":"hours"},"summer":"moderate"}',
 '{"ph":{"min":5.5,"max":7.0},"drainage":"good"}',
 '{"need":"medium_high"}','high','medium','catalog'),
('cerejeira','Cerejeira','Prunus avium','fruit_tree',array['cereja'],array['Portugal — Norte','Portugal — Centro'],'Exige frio invernal e é vulnerável a chuva e geada em fases críticas.',
 '{"winter_chill":{"min":700,"max":1400,"unit":"hours"},"summer":"moderate"}',
 '{"ph":{"min":6.0,"max":7.5},"drainage":"excellent"}',
 '{"need":"medium"}','high','medium','catalog'),
('amendoeira','Amendoeira','Prunus dulcis','fruit_tree',array['amêndoa'],array['Portugal — Norte','Portugal — Centro','Portugal — Lisboa e Vale do Tejo','Portugal — Alentejo','Portugal — Algarve'],'Tolerante à seca, mas a floração precoce aumenta o risco de geada tardia.',
 '{"winter_chill":{"min":100,"max":500,"unit":"hours"},"summer":"hot_dry"}',
 '{"ph":{"min":6.0,"max":8.0},"drainage":"excellent"}',
 '{"need":"low_medium"}','medium','high','catalog'),
('nogueira','Nogueira','Juglans regia','fruit_tree',array['noz'],array['Portugal — Norte','Portugal — Centro'],'Fruteira com necessidade de solos profundos e disponibilidade hídrica.',
 '{"winter_chill":{"min":500,"max":1000,"unit":"hours"},"summer":"warm"}',
 '{"ph":{"min":6.0,"max":7.5},"depth":"deep","drainage":"good"}',
 '{"need":"high"}','high','medium','catalog'),
('milho','Milho','Zea mays','cereal',array['maize'],array['Portugal — Norte','Portugal — Centro','Portugal — Lisboa e Vale do Tejo','Portugal — Alentejo'],'Cereal de verão com elevada necessidade hídrica em produção intensiva.',
 '{"summer":"warm_hot","frost_free":true}',
 '{"ph":{"min":5.8,"max":7.2},"fertility":"medium_high"}',
 '{"need":"high"}','low','high','catalog'),
('trigo','Trigo','Triticum aestivum','cereal',array['cereal'],array['Portugal — Norte','Portugal — Centro','Portugal — Lisboa e Vale do Tejo','Portugal — Alentejo'],'Cereal de inverno com ampla adaptação regional.',
 '{"winter":"cool","summer":"dry_at_harvest"}',
 '{"ph":{"min":6.0,"max":7.5},"drainage":"good"}',
 '{"need":"low_medium"}','high','medium','catalog'),
('batata','Batata','Solanum tuberosum','horticulture',array['batateira'],array['Portugal — Norte','Portugal — Centro','Portugal — Açores'],'Cultura de ciclo curto, favorecida por temperaturas moderadas e solos soltos.',
 '{"temperature":{"min":10,"max":24,"unit":"celsius"}}',
 '{"ph":{"min":5.0,"max":6.5},"texture":"loose"}',
 '{"need":"medium_high"}','medium','low','catalog'),
('pistacio','Pistácio','Pistacia vera','fruit_tree',array['pistache'],array['Portugal — Interior Norte','Portugal — Interior Centro','Portugal — Alentejo'],'Fruteira de clima continental, com verão quente e seco e inverno frio.',
 '{"winter_chill":{"min":600,"max":1000,"unit":"hours"},"summer":"hot_dry"}',
 '{"ph":{"min":6.0,"max":8.0},"drainage":"excellent"}',
 '{"need":"low_medium"}','high','high','catalog')
on conflict (slug) do update set
  common_name = excluded.common_name,
  scientific_name = excluded.scientific_name,
  category = excluded.category,
  aliases = excluded.aliases,
  recommended_regions = excluded.recommended_regions,
  description = excluded.description,
  climate_profile = excluded.climate_profile,
  soil_profile = excluded.soil_profile,
  water_profile = excluded.water_profile,
  frost_tolerance = excluded.frost_tolerance,
  heat_tolerance = excluded.heat_tolerance,
  updated_at = now();

notify pgrst, 'reload schema';
