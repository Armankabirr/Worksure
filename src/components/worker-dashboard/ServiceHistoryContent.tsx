import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { History, CheckCircle, Loader2, DollarSign, Play } from "lucide-react";
import { ApiServiceRequest } from "@/types/workerDashboard";
import {
  isCompletedStatus,
  isCompletedByWorkerStatus,
  isConfirmedStatus,
  isCancelledStatus,
  isInProgressStatus,
} from "@/lib/workerDashboardUtils";

interface ServiceHistoryContentProps {
  workHistory: ApiServiceRequest[];
  workHistoryLoading: boolean;
  confirmedWorks: ApiServiceRequest[];
  inProgressWorks: ApiServiceRequest[];
  awaitingConfirmationWorks: ApiServiceRequest[];
  completedWorks: ApiServiceRequest[];
  cancelledWorks: ApiServiceRequest[];
  actionLoading: boolean;
  onCompleteWork: (id: string) => void;
  onCancelWork: (id: string) => void;
  onViewPricing: (work: ApiServiceRequest) => void;
  onStartWork: (id: string) => void;
}

export const ServiceHistoryContent = ({
  workHistory,
  workHistoryLoading,
  confirmedWorks,
  inProgressWorks,
  awaitingConfirmationWorks,
  completedWorks,
  cancelledWorks,
  actionLoading,
  onCompleteWork,
  onCancelWork,
  onViewPricing,
  onStartWork,
}: ServiceHistoryContentProps) => {
  const renderHistoryTable = (
    data: ApiServiceRequest[],
    emptyMessage: string,
    showActions: boolean = false
  ) => (
    <Card className="overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Client Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Service
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Date & Time
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Location
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              {showActions && (
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              )}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {data.length === 0 ? (
              <tr>
                <td colSpan={showActions ? 6 : 5} className="px-6 py-12 text-center">
                  <div className="flex flex-col items-center justify-center">
                    <History className="h-16 w-16 text-gray-300 mb-4" />
                    <p className="text-gray-500 text-lg font-medium">{emptyMessage}</p>
                  </div>
                </td>
              </tr>
            ) : (
              data.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="h-10 w-10 rounded-full bg-gray-300 mr-3 overflow-hidden">
                        {(item.users_orders_client_idTousers?.select?.profile_picture ||
                          item.users_orders_client_idTousers?.profile_picture) && (
                          <img
                            src={
                              item.users_orders_client_idTousers?.select?.profile_picture ||
                              item.users_orders_client_idTousers?.profile_picture
                            }
                            alt="Client"
                            className="w-full h-full object-cover"
                          />
                        )}
                      </div>
                      <span className="text-sm font-medium text-gray-900">
                        {item.users_orders_client_idTousers?.select?.full_name ||
                          item.users_orders_client_idTousers?.full_name ||
                          "Client"}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {item.description || "-"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {item.selected_time
                      ? new Date(item.selected_time).toLocaleString()
                      : "-"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {item.address || "-"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        isCompletedStatus(item.status)
                          ? "bg-green-100 text-green-800"
                          : isCompletedByWorkerStatus(item.status)
                          ? "bg-amber-100 text-amber-800"
                          : isConfirmedStatus(item.status)
                          ? "bg-blue-100 text-blue-800"
                          : isCancelledStatus(item.status)
                          ? "bg-red-100 text-red-800"
                          : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      {isCompletedByWorkerStatus(item.status)
                        ? "Awaiting Confirmation"
                        : item.status || "-"}
                    </span>
                  </td>
                  {showActions && (
                    <td className="px-6 py-4 whitespace-nowrap text-sm flex gap-2">
                      {/* Show Start button for confirmed tasks that haven't started yet */}
                      {isConfirmedStatus(item.status) &&
                        !isCompletedByWorkerStatus(item.status) &&
                        item.status?.toLowerCase() !== "in_progress" && (
                          <>
                            <Button
                              size="sm"
                              className="bg-green-600 hover:bg-green-700 text-white px-3"
                              onClick={() => onStartWork(item.id)}
                              disabled={actionLoading}
                            >
                              <Play className="h-4 w-4 mr-1" />
                              Start
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              className="text-red-600 border border-red-200 px-3"
                              onClick={() => onCancelWork(item.id)}
                              disabled={actionLoading}
                            >
                              Cancel
                            </Button>
                          </>
                        )}

                      {/* Show Complete button for in-progress tasks */}
                      {item.status?.toLowerCase() === "in_progress" &&
                        !isCompletedByWorkerStatus(item.status) && (
                          <>
                            <Button
                              size="sm"
                              className="bg-blue-600 hover:bg-blue-700 text-white px-3"
                              onClick={() => onCompleteWork(item.id)}
                              disabled={actionLoading}
                            >
                              <CheckCircle className="h-4 w-4 mr-1" />
                              Complete
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              className="text-red-600 border border-red-200 px-3"
                              onClick={() => onCancelWork(item.id)}
                              disabled={actionLoading}
                            >
                              Cancel
                            </Button>
                          </>
                        )}

                      {/* Show waiting state for completed_by_worker */}
                      {isCompletedByWorkerStatus(item.status) && (
                        <div className="flex items-center gap-2">
                          <div className="flex items-center text-amber-600 bg-amber-50 px-3 py-1.5 rounded-lg">
                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                            <span className="text-sm font-medium">
                              Waiting for User Confirmation
                            </span>
                          </div>
                          <Button
                            size="sm"
                            variant="outline"
                            className="text-blue-600 border-blue-200 px-3"
                            onClick={() => onViewPricing(item)}
                          >
                            <DollarSign className="h-4 w-4 mr-1" />
                            View Pricing
                          </Button>
                        </div>
                      )}

                      {/* Show view pricing for completed tasks */}
                      {isCompletedStatus(item.status) && (
                        <Button
                          size="sm"
                          variant="outline"
                          className="text-green-600 border-green-200 px-3"
                          onClick={() => onViewPricing(item)}
                        >
                          <DollarSign className="h-4 w-4 mr-1" />
                          View Pricing
                        </Button>
                      )}
                    </td>
                  )}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </Card>
  );

  return (
    <div>
      <h2 className="text-2xl font-bold text-orange-500 mb-6">Service History</h2>
      {workHistoryLoading ? (
        <Card className="p-12 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
          <p className="text-gray-500">Loading work history...</p>
        </Card>
      ) : (
        <Tabs defaultValue="all" className="w-full ">
          <TabsList className="grid w-full grid-cols-6 mb-6 bg-gray-200 rounded-lg">
            <TabsTrigger value="all">All ({workHistory.length})</TabsTrigger>
            <TabsTrigger value="confirmed">
              Upcoming ({confirmedWorks.length})
            </TabsTrigger>
            <TabsTrigger value="inprogress" className="text-blue-600">
              In progress ({inProgressWorks.length})
            </TabsTrigger>
            <TabsTrigger value="awaiting" className="text-amber-600">
              Awaiting ({awaitingConfirmationWorks.length})
            </TabsTrigger>
            <TabsTrigger value="completed" className="text-green-600">
              Completed ({completedWorks.length})
            </TabsTrigger>
            <TabsTrigger value="cancelled" className="text-red-600">
              Cancelled ({cancelledWorks.length})
            </TabsTrigger>
          </TabsList>
          <TabsContent value="all">
            {renderHistoryTable(workHistory, "No work history available", true)}
          </TabsContent>
          <TabsContent value="confirmed">
            {renderHistoryTable(confirmedWorks, "No upcoming works", true)}
          </TabsContent>
          <TabsContent value="inprogress">
            {renderHistoryTable(inProgressWorks, "No works in progress", true)}
          </TabsContent>
          <TabsContent value="awaiting">
            {renderHistoryTable(
              awaitingConfirmationWorks,
              "No works awaiting user confirmation",
              true
            )}
          </TabsContent>
          <TabsContent value="completed">
            {renderHistoryTable(completedWorks, "No completed works", true)}
          </TabsContent>
          <TabsContent value="cancelled">
            {renderHistoryTable(cancelledWorks, "No cancelled works")}
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
};

export default ServiceHistoryContent;
