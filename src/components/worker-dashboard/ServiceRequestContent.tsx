import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ClipboardList } from "lucide-react";
import { ApiServiceRequest } from "@/types/workerDashboard";

interface ServiceRequestContentProps {
  serviceRequests: ApiServiceRequest[];
  serviceRequestsLoading: boolean;
  actionLoading: boolean;
  onViewDetails: (request: ApiServiceRequest) => void;
  onAccept: (id: string) => void;
  onCancel: (id: string) => void;
}

export const ServiceRequestContent = ({
  serviceRequests,
  serviceRequestsLoading,
  actionLoading,
  onViewDetails,
  onAccept,
  onCancel,
}: ServiceRequestContentProps) => {
  return (
    <div>
      <h2 className="text-2xl font-bold text-orange-500 mb-6">Service Request</h2>
      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  User Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Task
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Amount
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Location
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {serviceRequestsLoading ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center">
                    <div className="flex flex-col items-center justify-center">
                      <ClipboardList className="h-16 w-16 text-gray-300 mb-4" />
                      <p className="text-gray-500 text-lg font-medium">
                        Loading service requests...
                      </p>
                    </div>
                  </td>
                </tr>
              ) : serviceRequests.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center">
                    <div className="flex flex-col items-center justify-center">
                      <ClipboardList className="h-16 w-16 text-gray-300 mb-4" />
                      <p className="text-gray-500 text-lg font-medium">
                        No service request available now
                      </p>
                      <p className="text-gray-400 text-sm mt-2">
                        New service requests will appear here
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                serviceRequests.map((req: ApiServiceRequest) => (
                  <tr
                    key={req.id}
                    className="hover:bg-gray-50 transition-colors cursor-pointer"
                    onClick={() => onViewDetails(req)}
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="h-10 w-10 rounded-full bg-gray-300 mr-3 overflow-hidden">
                          {(req.users_orders_client_idTousers?.select?.profile_picture ||
                            req.users_orders_client_idTousers?.profile_picture) && (
                            <img
                              src={
                                req.users_orders_client_idTousers?.select?.profile_picture ||
                                req.users_orders_client_idTousers?.profile_picture
                              }
                              alt={
                                req.users_orders_client_idTousers?.select?.full_name ||
                                req.users_orders_client_idTousers?.full_name ||
                                "Client"
                              }
                              className="w-full h-full object-cover"
                            />
                          )}
                        </div>
                        <div className="text-sm font-medium text-gray-900">
                          {req.users_orders_client_idTousers?.select?.full_name ||
                            req.users_orders_client_idTousers?.full_name ||
                            "Client"}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {req.description || "-"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {req.total_amount != null ? `৳${req.total_amount}` : "-"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {req.address || "-"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-orange-100 text-orange-800">
                        {req.status || "-"}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm flex gap-2">
                      <Button
                        size="sm"
                        className="bg-green-600 hover:bg-green-700 text-white px-3"
                        onClick={(e) => {
                          e.stopPropagation();
                          onAccept(req.id);
                        }}
                        disabled={actionLoading || req.status === "Confirmed"}
                      >
                        Accept
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="text-red-600 border border-red-200 px-3"
                        onClick={(e) => {
                          e.stopPropagation();
                          onCancel(req.id);
                        }}
                        disabled={actionLoading || req.status === "Cancelled"}
                      >
                        Cancel
                      </Button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};

export default ServiceRequestContent;
