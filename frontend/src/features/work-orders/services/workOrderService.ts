import type { OperationalDataSource } from "../../shared/operationalDataSource";
import { unwrapRepositoryResult } from "../../../repositories/core/types";
import { workOrderRepository } from "../../../repositories/work-orders/workOrderRepository";
import type { WorkOrderDraft, WorkOrderStatus } from "../types/workOrder";
import {
  clearLocalWorkOrders, createWorkOrder as createLocal, deleteWorkOrder as deleteLocal,
  listWorkOrders as listLocal, updateWorkOrderStatus as updateLocalStatus,
} from "./workOrderStorage";

export const workOrderService = {
  async list(source: OperationalDataSource) {
    return source === "supabase" ? unwrapRepositoryResult(await workOrderRepository.list()) : listLocal();
  },
  async create(source: OperationalDataSource, draft: WorkOrderDraft) {
    return source === "supabase" ? unwrapRepositoryResult(await workOrderRepository.create(draft)) : createLocal(draft);
  },
  async updateStatus(source: OperationalDataSource, id: string, status: WorkOrderStatus) {
    if (source === "supabase") return unwrapRepositoryResult(await workOrderRepository.updateStatus(id, status));
    return updateLocalStatus(id, status).find((order) => order.id === id);
  },
  async remove(source: OperationalDataSource, id: string) {
    if (source === "supabase") { unwrapRepositoryResult(await workOrderRepository.remove(id)); return; }
    deleteLocal(id);
  },
  localCount() { return listLocal().length; },
  async migrateLocalToSupabase() {
    const orders = listLocal();
    for (const order of orders) unwrapRepositoryResult(await workOrderRepository.create(order, order.id));
    clearLocalWorkOrders();
    return orders.length;
  },
};
