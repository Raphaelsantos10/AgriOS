-- FARPHA Sprint 107: estabilização das políticas de acesso
-- Execute depois do bootstrap e das migrações dos módulos indicados abaixo.
-- A migração remove políticas de desenvolvimento abertas e limita os dados
-- agrícolas ao proprietário da exploração autenticado.

begin;

-- Com cadastro autosserviço, todo novo utilizador é owner da própria conta.
-- Isso não pode conceder leitura dos perfis de outras contas.
drop policy if exists "profile_read_self_or_admin" on public.user_profiles;
drop policy if exists profile_read_self on public.user_profiles;
create policy profile_read_self on public.user_profiles
for select to authenticated using (id = auth.uid());
revoke all on public.user_profiles from anon;

-- Ambiente do talhão.
drop policy if exists "Permitir leitura field_environment_profiles" on public.field_environment_profiles;
drop policy if exists "Permitir inserir field_environment_profiles" on public.field_environment_profiles;
drop policy if exists "Permitir atualizar field_environment_profiles" on public.field_environment_profiles;
drop policy if exists "Permitir apagar field_environment_profiles" on public.field_environment_profiles;
drop policy if exists environment_owner_all on public.field_environment_profiles;
create policy environment_owner_all on public.field_environment_profiles
for all to authenticated
using (exists (select 1 from public.farms f where f.id = farm_id and f.user_id = auth.uid()))
with check (exists (select 1 from public.farms f where f.id = farm_id and f.user_id = auth.uid()));
revoke all on public.field_environment_profiles from anon;
grant select, insert, update, delete on public.field_environment_profiles to authenticated;

-- Avaliações de risco de incêndio.
drop policy if exists "Permitir leitura fire assessments" on public.fire_risk_assessments;
drop policy if exists "Permitir criar fire assessments" on public.fire_risk_assessments;
drop policy if exists "Permitir apagar fire assessments" on public.fire_risk_assessments;
drop policy if exists fire_assessments_owner_all on public.fire_risk_assessments;
create policy fire_assessments_owner_all on public.fire_risk_assessments
for all to authenticated
using (exists (select 1 from public.farms f where f.id = farm_id and f.user_id = auth.uid()))
with check (exists (select 1 from public.farms f where f.id = farm_id and f.user_id = auth.uid()));
revoke all on public.fire_risk_assessments from anon;
grant select, insert, update, delete on public.fire_risk_assessments to authenticated;

-- Rega.
drop policy if exists "irrigation systems dev select" on public.irrigation_systems;
drop policy if exists "irrigation systems dev insert" on public.irrigation_systems;
drop policy if exists "irrigation systems dev update" on public.irrigation_systems;
drop policy if exists "irrigation systems dev delete" on public.irrigation_systems;
drop policy if exists irrigation_systems_owner_all on public.irrigation_systems;
create policy irrigation_systems_owner_all on public.irrigation_systems
for all to authenticated
using (exists (select 1 from public.farms f where f.id = farm_id and f.user_id = auth.uid()))
with check (exists (select 1 from public.farms f where f.id = farm_id and f.user_id = auth.uid()));
revoke all on public.irrigation_systems from anon;
grant select, insert, update, delete on public.irrigation_systems to authenticated;

drop policy if exists "irrigation events dev select" on public.irrigation_events;
drop policy if exists "irrigation events dev insert" on public.irrigation_events;
drop policy if exists "irrigation events dev update" on public.irrigation_events;
drop policy if exists "irrigation events dev delete" on public.irrigation_events;
drop policy if exists irrigation_events_owner_all on public.irrigation_events;
create policy irrigation_events_owner_all on public.irrigation_events
for all to authenticated
using (exists (select 1 from public.farms f where f.id = farm_id and f.user_id = auth.uid()))
with check (exists (select 1 from public.farms f where f.id = farm_id and f.user_id = auth.uid()));
revoke all on public.irrigation_events from anon;
grant select, insert, update, delete on public.irrigation_events to authenticated;

-- Ordens de trabalho.
drop policy if exists "Authenticated users can read work orders" on public.work_orders;
drop policy if exists "Authenticated users can create work orders" on public.work_orders;
drop policy if exists "Authenticated users can update work orders" on public.work_orders;
drop policy if exists "Authenticated users can delete work orders" on public.work_orders;
drop policy if exists work_orders_owner_all on public.work_orders;
create policy work_orders_owner_all on public.work_orders
for all to authenticated
using (exists (select 1 from public.farms f where f.id = farm_id and f.user_id = auth.uid()))
with check (exists (select 1 from public.farms f where f.id = farm_id and f.user_id = auth.uid()));
revoke all on public.work_orders from anon;
grant select, insert, update, delete on public.work_orders to authenticated;

-- Histórico dos talhões.
drop policy if exists "dev field history select" on public.field_history;
drop policy if exists "dev field history insert" on public.field_history;
drop policy if exists field_history_owner_all on public.field_history;
create policy field_history_owner_all on public.field_history
for all to authenticated
using (exists (select 1 from public.farms f where f.id = farm_id and f.user_id = auth.uid()))
with check (exists (select 1 from public.farms f where f.id = farm_id and f.user_id = auth.uid()));
revoke all on public.field_history from anon;
grant select, insert, update, delete on public.field_history to authenticated;

-- Observações de satélite.
drop policy if exists satellite_observations_owner_all on public.satellite_observations;
create policy satellite_observations_owner_all on public.satellite_observations
for all to authenticated
using (exists (select 1 from public.farms f where f.id = farm_id and f.user_id = auth.uid()))
with check (exists (select 1 from public.farms f where f.id = farm_id and f.user_id = auth.uid()));
revoke all on public.satellite_observations from anon;
grant select, insert, update, delete on public.satellite_observations to authenticated;

-- O catálogo oficial continua público para leitura, mas escrita anónima é removida.
drop policy if exists "Criar crop catalog desenvolvimento" on public.crop_catalog;
drop policy if exists "Atualizar crop catalog desenvolvimento" on public.crop_catalog;
drop policy if exists crop_catalog_custom_insert on public.crop_catalog;
drop policy if exists crop_catalog_custom_update on public.crop_catalog;
create policy crop_catalog_custom_insert on public.crop_catalog
for insert to authenticated
with check (source_type = 'custom' and created_by = auth.uid());
create policy crop_catalog_custom_update on public.crop_catalog
for update to authenticated
using (source_type = 'custom' and created_by = auth.uid())
with check (source_type = 'custom' and created_by = auth.uid());
revoke insert, update, delete on public.crop_catalog from anon;
grant select on public.crop_catalog to anon, authenticated;
grant insert, update on public.crop_catalog to authenticated;

notify pgrst, 'reload schema';
commit;
