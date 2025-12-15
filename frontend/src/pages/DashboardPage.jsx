import React from "react";
import {
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  BarChart,
  Bar,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { PieChart, Pie, Cell } from "recharts";
import { FiFolder, FiUsers, FiUserX, FiUserPlus, FiCheckSquare, FiCheck, FiX } from "react-icons/fi";
import { useTranslation } from "../services/translationService.jsx";

function SectionCard({ title, children }) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition">
      <div className="p-4">{children}</div>
    </div>
  );
}

export default function DashboardPage() {
  const { t } = useTranslation();

  return (
    <div className="flex-1 flex flex-col min-w-0">
      {/* BODY: main left + right column */}
      <div className="flex-1 flex overflow-hidden">
        {/* MAIN CENTER CONTENT */}
        <main className="flex-1 overflow-auto px-4 sm:px-6 py-4 space-y-4 md:pb-4 pb-24" >
          {/*
          BUSINESS OPERATIONS CARDS
          <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide sm:hidden">
            <div className="flex items-center gap-3 p-3 rounded-lg shadow-sm border border-grey-300 hover:shadow-md transition relative min-w-[140px] flex-shrink-0 bg-white bg-opacity-50">
              <div className="p-2 bg-blue-100 bg-opacity-50 shadow-md text-blue-600 rounded-lg border border-blue-300">
                <FiUserPlus size={18} />
              </div>
              <div>
                <div className="text-sm font-bold">24</div>
                <div className="text-xs font-medium text-gray-500">Total Leads</div>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 rounded-lg shadow-sm border border-grey-300 hover:shadow-md transition relative min-w-[140px] flex-shrink-0 bg-white bg-opacity-50">
              <div className="p-2 bg-orange-100 bg-opacity-50 shadow-md text-orange-500 rounded-lg border border-orange-300">
                <FiFolder size={18} />
              </div>
              <div>
                <div className="text-sm font-bold">50+</div>
                <div className="text-xs font-medium text-gray-500">
                  {t('Total Projects')}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 rounded-lg shadow-sm border border-grey-300 hover:shadow-md transition relative min-w-[140px] flex-shrink-0 bg-white bg-opacity-50">
              <div className="p-2 bg-green-100 bg-opacity-50 shadow-md text-green-500 rounded-lg border border-green-300">
                <FiUsers size={18} />
              </div>
              <div>
                <div className="text-sm font-bold">10+</div>
                <div className="text-xs font-medium text-gray-500">
                  {t('Total Clients')}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 rounded-lg shadow-sm border border-grey-300 hover:shadow-md transition relative min-w-[140px] flex-shrink-0 bg-white bg-opacity-50">
              <div className="p-2 bg-blue-100 bg-opacity-50 shadow-md text-blue-500 rounded-lg border border-blue-300">
                <FiUserX size={18} />
              </div>
              <div>
                <div className="text-sm font-bold">100+</div>
                <div className="text-xs font-medium text-gray-500">
                  {t('Total Employees')}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 rounded-lg shadow-sm border border-grey-300 hover:shadow-md transition relative min-w-[140px] flex-shrink-0 bg-white bg-opacity-50">
              <div className="p-2 bg-red-100 bg-opacity-50 shadow-md text-red-500 rounded-lg border border-red-300">
                <FiCheckSquare size={18} />
              </div>
              <div>
                <div className="text-sm font-bold">10+</div>
                <div className="text-xs font-medium text-gray-500">
                  Pending Task
                </div>
              </div>
            </div>
          </div>
          */}
          

          {/* DESKTOP/TABLET GRID VIEW */}
          {/*
          <div className="hidden sm:grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 text-[13px]">
            <div className="flex items-center gap-3 p-3 sm:p-4 rounded-lg shadow-sm border border-grey-300 hover:shadow-md transition relative bg-white bg-opacity-50">
              <div className="p-2 sm:p-3 bg-blue-100 bg-opacity-50 shadow-md text-blue-600 rounded-lg border border-blue-300">
                <FiUserPlus size={18} className="sm:w-5 sm:h-5" />
              </div>
              <div>
                <div className="text-sm sm:text-base font-bold">24</div>
                <div className="text-xs sm:text-sm font-medium text-gray-500">Total Leads</div>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 sm:p-4 rounded-lg shadow-sm border border-grey-300 hover:shadow-md transition relative bg-white bg-opacity-50">
              <div className="p-2 sm:p-3 bg-orange-100 bg-opacity-50 shadow-md text-orange-500 rounded-lg border border-orange-300">
                <FiFolder size={18} className="sm:w-5 sm:h-5" />
              </div>
              <div>
                <div className="text-sm sm:text-base font-bold">50+</div>
                <div className="text-xs sm:text-sm font-medium text-gray-500">
                  Total Projects
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 sm:p-4 rounded-lg shadow-sm border border-grey-300 hover:shadow-md transition relative bg-white bg-opacity-50">
              <div className="p-2 sm:p-3 bg-green-100 bg-opacity-50 shadow-md text-green-500 rounded-lg border border-green-300">
                <FiUsers size={18} className="sm:w-5 sm:h-5" />
              </div>
              <div>
                <div className="text-sm sm:text-base font-bold">10+</div>
                <div className="text-xs sm:text-sm font-medium text-gray-500">
                  Total Clients
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 sm:p-4 rounded-lg shadow-sm border border-grey-300 hover:shadow-md transition relative bg-white bg-opacity-50">
              <div className="p-2 sm:p-3 bg-red-100 bg-opacity-50 shadow-md text-red-500 rounded-lg border border-red-300">
                <FiCheckSquare size={18} className="sm:w-5 sm:h-5" />
              </div>
              <div>
                <div className="text-sm sm:text-base font-bold">10+</div>
                <div className="text-xs sm:text-sm font-medium text-gray-500">
                  Pending Task
                </div>
              </div>
            </div>
          </div>
          */}

          {/* LEADS SUMMARY + TODAY TASK + PROJECT SUMMARY (THREE COLUMNS) */}
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-3 sm:gap-4 ">
            {/* LEFT — LEADS SUMMARY TABLE */}
            <div className="bg-white rounded-xl border border-gray-400 p-3 sm:p-4 shadow-sm hover:shadow-lg transition-shadow duration-300 h-auto">
              {/* TABLE HEADER */}
              <div className="flex items-center justify-between mb-3 sm:mb-4">
                <h2 className="text-lg font-semibold text-gray-800">
                  Open Leads
                </h2>
              </div>

              {/* RESPONSIVE TABLE */}
              <table className="w-full text-left text-xs sm:text-[13px] table-fixed">
                <thead>
                  <tr className="border-b">
                    <th className="py-2 px-1 w-[30%] break-words">Name</th>
                    <th className="py-2 px-1 w-[40%] break-words">Email</th>
                    <th className="py-2 px-1 w-[30%] break-words">Status</th>
                  </tr>
                </thead>

                <tbody className="text-gray-700">
                  <tr className="border-b">
                    <td className="py-2 sm:py-3 px-1 break-words">
                      Mahendra Rathore
                    </td>
                    <td className="py-2 sm:py-3 px-1 break-words break-all">
                      mahendra@gmail.com
                    </td>
                    <td className="py-2 sm:py-3 px-1 break-words">
                      <span className="px-2 py-0.5 bg-blue-100 text-blue-700 rounded-full text-xs">
                        New Lead
                      </span>
                    </td>
                  </tr>

                  <tr className="border-b">
                    <td className="py-2 sm:py-3 px-1 break-words">
                      Sunita Choudhary
                    </td>
                    <td className="py-2 sm:py-3 px-1 break-words break-all">
                      sunita@gmail.com
                    </td>
                    <td className="py-2 sm:py-3 px-1 break-words">
                      <span className="px-2 py-0.5 bg-yellow-100 text-yellow-700 rounded-full text-xs">
                        Contacted
                      </span>
                    </td>
                  </tr>

                  <tr className="border-b">
                    <td className="py-2 sm:py-3 px-1 break-words">
                      Imran Khan
                    </td>
                    <td className="py-2 sm:py-3 px-1 break-words break-all">
                      imran.khan@gmail.com
                    </td>
                    <td className="py-2 sm:py-3 px-1 break-words">
                      <span className="px-2 py-0.5 bg-green-100 text-green-700 rounded-full text-xs">
                        Qualified
                      </span>
                    </td>
                  </tr>

                  <tr className="border-b">
                    <td className="py-2 sm:py-3 px-1 break-words">
                      Pooja Sharma
                    </td>
                    <td className="py-2 sm:py-3 px-1 break-words break-all">
                      pooja.sharma@gmail.com
                    </td>
                    <td className="py-2 sm:py-3 px-1 break-words">
                      <span className="px-2 py-0.5 bg-purple-100 text-purple-700 rounded-full text-xs">
                        Proposal
                      </span>
                    </td>
                  </tr>

                  <tr>
                    <td className="py-2 sm:py-3 px-1 break-words">
                      Vikas Kumawat
                    </td>
                    <td className="py-2 sm:py-3 px-1 break-words break-all">
                      vikas@gmail.com
                    </td>
                    <td className="py-2 sm:py-3 px-1 break-words">
                      <span className="px-2 py-0.5 bg-orange-100 text-orange-700 rounded-full text-xs">
                        Negotiation
                      </span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* MIDDLE — TODAY TASK */}
            <div className="bg-white rounded-xl border border-gray-400 p-3 sm:p-4 shadow-sm hover:shadow-lg transition-shadow duration-300 h-auto">
              {/* TABLE HEADER */}
              <div className="flex items-center justify-between mb-3 sm:mb-4">
                <h2 className="text-lg font-semibold text-gray-800">
                  My Task
                </h2>
              </div>

              {/* RESPONSIVE TABLE */}
              <table className="w-full text-left text-xs sm:text-[13px]">
                <thead>
                  <tr className="border-b">
                    <th className="py-2 px-1 break-words">Task Name</th>
                    <th className="py-2 px-1 break-words">Due Date</th>
                    <th className="py-2 px-1 break-words">Status</th>
                  </tr>
                </thead>

                <tbody className="text-gray-700">
                  <tr className="border-b">
                    <td className="py-2 sm:py-3 px-1 break-words">
                      Site visit - Jaipur
                    </td>
                    <td className="py-2 sm:py-3 px-1 break-words">
                      Dec 05, 2025
                    </td>
                    <td className="py-2 sm:py-3 px-1 break-words">
                      <span className="px-2 py-0.5 bg-green-100 text-green-700 rounded-full text-xs">
                        Completed
                      </span>
                    </td>
                  </tr>

                  <tr className="border-b">
                    <td className="py-2 sm:py-3 px-1 break-words">
                      Send Estimate - Jodhpur
                    </td>
                    <td className="py-2 sm:py-3 px-1 break-words">
                      Dec 02, 2025
                    </td>
                    <td className="py-2 sm:py-3 px-1 break-words">
                      <span className="px-2 py-0.5 bg-yellow-100 text-yellow-700 rounded-full text-xs">
                        Delayed
                      </span>
                    </td>
                  </tr>

                  <tr className="border-b">
                    <td className="py-2 sm:py-3 px-1 break-words">
                      Client follow up - Udaipur
                    </td>
                    <td className="py-2 sm:py-3 px-1 break-words">
                      Dec 12, 2025
                    </td>
                    <td className="py-2 sm:py-3 px-1 break-words">
                      <span className="px-2 py-0.5 bg-red-100 text-red-700 rounded-full text-xs">
                        At risk
                      </span>
                    </td>
                  </tr>

                  <tr className="border-b">
                    <td className="py-2 sm:py-3 px-1 break-words">
                      Material list update - Kota
                    </td>
                    <td className="py-2 sm:py-3 px-1 break-words">
                      Dec 03, 2025
                    </td>
                    <td className="py-2 sm:py-3 px-1 break-words">
                      <span className="px-2 py-0.5 bg-green-100 text-green-700 rounded-full text-xs">
                        Completed
                      </span>
                    </td>
                  </tr>

                  <tr>
                    <td className="py-2 sm:py-3 px-1 break-words">
                      Layout plan review
                    </td>
                    <td className="py-2 sm:py-3 px-1 break-words">
                      Dec 05, 2025
                    </td>
                    <td className="py-2 sm:py-3 px-1 break-words">
                      <span className="px-2 py-0.5 bg-orange-100 text-orange-700 rounded-full text-xs">
                        On going
                      </span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* RIGHT — PROJECT SUMMARY TABLE */}
            <div className="bg-white rounded-xl border border-gray-400 p-3 sm:p-4 shadow-sm hover:shadow-lg transition-shadow duration-300 h-auto">
              {/* TABLE HEADER */}
              <div className="flex items-center justify-between mb-3 sm:mb-4">
                <h2 className="text-lg font-semibold text-gray-800">
                  Project Summary
                </h2>
              </div>

              {/* RESPONSIVE TABLE */}
              <table className="w-full text-left text-xs sm:text-[13px]">
                <thead>
                  <tr className="border-b">
                    <th className="py-2 px-1 break-words">Name</th>
                    <th className="py-2 px-1 break-words">Due Date</th>
                    <th className="py-2 px-1 break-words">Progress</th>
                  </tr>
                </thead>

                <tbody className="text-gray-700">
                  <tr className="border-b">
                    <td className="py-2 sm:py-3 px-1 break-words">
                      High Rise Tower
                    </td>
                    <td className="py-2 sm:py-3 px-1 break-words">
                      May 25, 2023
                    </td>
                    <td className="py-2 sm:py-3 px-1 break-words">
                      <div className="flex items-center gap-2">
                        <div className="w-16 sm:w-20 h-2 bg-gray-200 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-green-500 rounded-full"
                            style={{ width: "100%" }}
                          ></div>
                        </div>
                        <span className="text-xs text-gray-600">100%</span>
                      </div>
                    </td>
                  </tr>

                  <tr className="border-b">
                    <td className="py-2 sm:py-3 px-1 break-words">
                      Residential Complex
                    </td>
                    <td className="py-2 sm:py-3 px-1 break-words">
                      Jun 20, 2023
                    </td>
                    <td className="py-2 sm:py-3 px-1 break-words">
                      <div className="flex items-center gap-2">
                        <div className="w-16 sm:w-20 h-2 bg-gray-200 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-yellow-500 rounded-full"
                            style={{ width: "35%" }}
                          ></div>
                        </div>
                        <span className="text-xs text-gray-600">35%</span>
                      </div>
                    </td>
                  </tr>

                  <tr className="border-b">
                    <td className="py-2 sm:py-3 px-1 break-words">
                      Shopping Mall
                    </td>
                    <td className="py-2 sm:py-3 px-1 break-words">
                      July 13, 2023
                    </td>
                    <td className="py-2 sm:py-3 px-1 break-words">
                      <div className="flex items-center gap-2">
                        <div className="w-16 sm:w-20 h-2 bg-gray-200 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-red-500 rounded-full"
                            style={{ width: "68%" }}
                          ></div>
                        </div>
                        <span className="text-xs text-gray-600">68%</span>
                      </div>
                    </td>
                  </tr>

                  <tr className="border-b">
                    <td className="py-2 sm:py-3 px-1 break-words">
                      Office Building
                    </td>
                    <td className="py-2 sm:py-3 px-1 break-words">
                      Dec 20, 2023
                    </td>
                    <td className="py-2 sm:py-3 px-1 break-words">
                      <div className="flex items-center gap-2">
                        <div className="w-16 sm:w-20 h-2 bg-gray-200 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-green-500 rounded-full"
                            style={{ width: "100%" }}
                          ></div>
                        </div>
                        <span className="text-xs text-gray-600">100%</span>
                      </div>
                    </td>
                  </tr>

                  <tr>
                    <td className="py-2 sm:py-3 px-1 break-words">
                      Hospital Construction
                    </td>
                    <td className="py-2 sm:py-3 px-1 break-words">
                      Mar 15, 2024
                    </td>
                    <td className="py-2 sm:py-3 px-1 break-words">
                      <div className="flex items-center gap-2">
                        <div className="w-16 sm:w-20 h-2 bg-gray-200 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-orange-500 rounded-full"
                            style={{ width: "50%" }}
                          ></div>
                        </div>
                        <span className="text-xs text-gray-600">50%</span>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-2 gap-3 sm:gap-4 mt-3 sm:mt-4">
            {/* LEFT — MATERIAL REQUEST */}
            <div className="bg-white rounded-xl border border-gray-400 p-3 sm:p-4 shadow-sm hover:shadow-lg transition-shadow duration-300 h-auto">
              {/* TABLE HEADER */}
              <div className="flex items-center justify-between mb-3 sm:mb-4">
                <h2 className="text-lg font-semibold text-gray-800">
                  Material Request
                </h2>
              </div>

              {/* RESPONSIVE TABLE */}
              <table className="w-full text-left text-xs sm:text-[13px]">
                <thead>
                  <tr className="border-b">
                    <th className="py-2 px-1 break-words">
                      Project Name
                    </th>
                    <th className="py-2 px-1 break-words">Material</th>
                    <th className="py-2 px-1 break-words">Action</th>
                  </tr>
                </thead>

                <tbody className="text-gray-700">
                  <tr className="border-b">
                    <td className="py-2 sm:py-3 px-1 break-words">
                      High Rise Tower
                    </td>
                    <td className="py-2 sm:py-3 px-1 break-words">
                      Steel Bars
                    </td>
                    <td className="py-2 sm:py-3 px-1 break-words">
                      <div className="flex flex-row gap-1">
                        <button className="px-2 py-0.5 bg-green-100 text-green-700 border border-green-300 rounded-full text-xs hover:bg-green-200 font-medium leading-none flex items-center justify-center gap-1">
                          <FiCheck size={12} className="sm:hidden" />
                          <span className="hidden sm:inline">Approve</span>
                        </button>
                        <button className="px-2 py-0.5 bg-red-100 text-red-700 border border-red-300 rounded-full text-xs hover:bg-red-200 font-medium leading-none flex items-center justify-center gap-1">
                          <FiX size={12} className="sm:hidden" />
                          <span className="hidden sm:inline">Reject</span>
                        </button>
                      </div>
                    </td>
                  </tr>

                  <tr className="border-b">
                    <td className="py-2 sm:py-3 px-1 break-words">
                      Shopping Mall
                    </td>
                    <td className="py-2 sm:py-3 px-1 break-words">
                      Glass Panels
                    </td>
                    <td className="py-2 sm:py-3 px-1 break-words">
                      <div className="flex flex-row gap-1">
                        <button className="px-2 py-0.5 bg-green-100 text-green-700 border border-green-300 rounded-full text-xs hover:bg-green-200 font-medium leading-none flex items-center justify-center gap-1">
                          <FiCheck size={12} className="sm:hidden" />
                          <span className="hidden sm:inline">Approve</span>
                        </button>
                        <button className="px-2 py-0.5 bg-red-100 text-red-700 border border-red-300 rounded-full text-xs hover:bg-red-200 font-medium leading-none flex items-center justify-center gap-1">
                          <FiX size={12} className="sm:hidden" />
                          <span className="hidden sm:inline">Reject</span>
                        </button>
                      </div>
                    </td>
                  </tr>

                  <tr className="border-b">
                    <td className="py-2 sm:py-3 px-1 break-words">
                      Office Building
                    </td>
                    <td className="py-2 sm:py-3 px-1 break-words">
                      Concrete Blocks
                    </td>
                    <td className="py-2 sm:py-3 px-1 break-words">
                      <div className="flex flex-row gap-1">
                        <button className="px-2 py-0.5 bg-green-100 text-green-700 border border-green-300 rounded-full text-xs hover:bg-green-200 font-medium leading-none flex items-center justify-center gap-1">
                          <FiCheck size={12} className="sm:hidden" />
                          <span className="hidden sm:inline">Approve</span>
                        </button>
                        <button className="px-2 py-0.5 bg-red-100 text-red-700 border border-red-300 rounded-full text-xs hover:bg-red-200 font-medium leading-none flex items-center justify-center gap-1">
                          <FiX size={12} className="sm:hidden" />
                          <span className="hidden sm:inline">Reject</span>
                        </button>
                      </div>
                    </td>
                  </tr>

                  <tr>
                    <td className="py-2 sm:py-3 px-1 break-words">
                      Hospital Construction
                    </td>
                    <td className="py-2 sm:py-3 px-1 break-words">
                      Electrical Cables
                    </td>
                    <td className="py-2 sm:py-3 px-1 break-words">
                      <div className="flex flex-row gap-1">
                        <button className="px-2 py-0.5 bg-green-100 text-green-700 border border-green-300 rounded-full text-xs hover:bg-green-200 font-medium leading-none flex items-center justify-center gap-1">
                          <FiCheck size={12} className="sm:hidden" />
                          <span className="hidden sm:inline">Approve</span>
                        </button>
                        <button className="px-2 py-0.5 bg-red-100 text-red-700 border border-red-300 rounded-full text-xs hover:bg-red-200 font-medium leading-none flex items-center justify-center gap-1">
                          <FiX size={12} className="sm:hidden" />
                          <span className="hidden sm:inline">Reject</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* RIGHT — RECENT TRANSACTION */}
            <div className="bg-white rounded-xl border border-gray-400 p-3 sm:p-4 shadow-sm hover:shadow-lg transition-shadow duration-300 h-auto">
              {/* TABLE HEADER */}
              <div className="flex items-center justify-between mb-3 sm:mb-4">
                <h2 className="text-lg font-semibold text-gray-800">
                  Recent Transaction
                </h2>
              </div>

              {/* RESPONSIVE TABLE */}
              <table className="w-full text-left text-xs sm:text-[13px]">
                <thead>
                  <tr className="border-b">
                    <th className="py-2 px-1 break-words">
                      Project Name
                    </th>
                    <th className="py-2 px-1 break-words">Date</th>
                    <th className="py-2 px-1 break-words hidden sm:table-cell">
                      Transaction
                    </th>
                    <th className="py-2 px-1 break-words">Amount</th>
                  </tr>
                </thead>

                <tbody className="text-gray-700">
                  <tr className="border-b">
                    <td className="py-2 sm:py-3 px-1 break-words">
                      High Rise Tower
                    </td>
                    <td className="py-2 sm:py-3 px-1 break-words">
                      May 25, 2023
                    </td>
                    <td className="py-2 sm:py-3 px-1 break-words hidden sm:table-cell">
                      <span className="px-2 py-0.5 bg-green-100 text-green-700 rounded-full text-xs">
                        Invoice Paid
                      </span>
                    </td>
                    <td className="py-2 sm:py-3 px-1 break-words">
                      <span className="px-2 py-0.5 bg-blue-100 text-blue-700 rounded-full text-xs">
                        ₹1,00,000
                      </span>
                    </td>
                  </tr>

                  <tr className="border-b">
                    <td className="py-2 sm:py-3 px-1 break-words">
                      Residential Complex
                    </td>
                    <td className="py-2 sm:py-3 px-1 break-words">
                      Jun 20, 2023
                    </td>
                    <td className="py-2 sm:py-3 px-1 break-words hidden sm:table-cell">
                      <span className="px-2 py-0.5 bg-yellow-100 text-yellow-700 rounded-full text-xs">
                        Advance Received
                      </span>
                    </td>
                    <td className="py-2 sm:py-3 px-1 break-words">
                      <span className="px-2 py-0.5 bg-blue-100 text-blue-700 rounded-full text-xs">
                        ₹50,000
                      </span>
                    </td>
                  </tr>

                  <tr className="border-b">
                    <td className="py-2 sm:py-3 px-1 break-words">
                      Shopping Mall
                    </td>
                    <td className="py-2 sm:py-3 px-1 break-words">
                      July 13, 2023
                    </td>
                    <td className="py-2 sm:py-3 px-1 break-words hidden sm:table-cell">
                      <span className="px-2 py-0.5 bg-red-100 text-red-700 rounded-full text-xs">
                        Contract Signed
                      </span>
                    </td>
                    <td className="py-2 sm:py-3 px-1 break-words">
                      <span className="px-2 py-0.5 bg-blue-100 text-blue-700 rounded-full text-xs">
                        ₹2,00,000
                      </span>
                    </td>
                  </tr>

                  <tr className="border-b">
                    <td className="py-2 sm:py-3 px-1 break-words">
                      Office Building
                    </td>
                    <td className="py-2 sm:py-3 px-1 break-words">
                      Dec 20, 2023
                    </td>
                    <td className="py-2 sm:py-3 px-1 break-words hidden sm:table-cell">
                      <span className="px-2 py-0.5 bg-green-100 text-green-700 rounded-full text-xs">
                        Final Payment
                      </span>
                    </td>
                    <td className="py-2 sm:py-3 px-1 break-words">
                      <span className="px-2 py-0.5 bg-blue-100 text-blue-700 rounded-full text-xs">
                        ₹4,00,000
                      </span>
                    </td>
                  </tr>

                  <tr>
                    <td className="py-2 sm:py-3 px-1 break-words">
                      Hospital Construction
                    </td>
                    <td className="py-2 sm:py-3 px-1 break-words">
                      Dec 20, 2023
                    </td>
                    <td className="py-2 sm:py-3 px-1 break-words hidden sm:table-cell">
                      <span className="px-2 py-0.5 bg-orange-100 text-orange-700 rounded-full text-xs">
                        Milestone Payment
                      </span>
                    </td>
                    <td className="py-2 sm:py-3 px-1 break-words">
                      <span className="px-2 py-0.5 bg-blue-100 text-blue-700 rounded-full text-xs">
                        ₹3,00,000
                      </span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/*
          ANALYTICS CHARTS ROW
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-3 sm:gap-4 pb-6 sm:pb-10">
            <div className="bg-white p-3 sm:p-4 rounded-xl border border-gray-200 shadow-sm h-auto xl:h-[350px]">
              <div className="flex items-center justify-between mt-1 mb-2">
                <h2 className="text-sm sm:text-[16px] font-semibold text-gray-700">
                  Overall Progress
                </h2>
                <button className="text-[10px] sm:text-[11px] bg-white px-2 py-0.5 rounded-full border border-gray-200">
                  All ▾
                </button>
              </div>
              <div className="relative w-full h-32 sm:h-40 flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={[{ value: 72 }, { value: 15 }, { value: 13 }]}
                      cx="50%"
                      cy="100%"
                      startAngle={180}
                      endAngle={0}
                      innerRadius={50}
                      outerRadius={85}
                      paddingAngle={5}
                    >
                      <Cell fill="#16a34a" />
                      <Cell fill="#facc15" />
                      <Cell fill="#f87171" />
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
                <div className="absolute text-center mt-[80px] sm:mt-[100px]">
                  <div className="text-lg sm:text-xl font-bold text-gray-800">
                    72%
                  </div>
                  <div className="text-xs text-gray-500 -mt-1">Completed</div>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-2 text-center mt-2 sm:mt-3 text-[10px] sm:text-[11px]">
                <div>
                  <div className="font-bold text-lg sm:text-[20px] text-green-600">
                    26
                  </div>
                  <div className="text-gray-500">Done</div>
                </div>
                <div>
                  <div className="font-bold text-lg sm:text-[20px] text-yellow-500">
                    35
                  </div>
                  <div className="text-gray-500">Delay</div>
                </div>
                <div>
                  <div className="font-bold text-lg sm:text-[20px] text-orange-500">
                    35
                  </div>
                  <div className="text-gray-500">Ongoing</div>
                </div>
              </div>
            </div>
            <div className="bg-white p-3 sm:p-4 rounded-xl border border-gray-200 shadow-sm h-auto xl:h-[350px]">
              <h2 className="text-sm sm:text-[16px] font-semibold text-gray-800 mb-2">
                Performance Analytics
              </h2>
              <div className="w-full h-[180px] sm:h-[220px] mt-4 sm:mt-8">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={[
                      { name: "Jan", projects: 24, revenue: 40 },
                      { name: "Feb", projects: 13, revenue: 30 },
                      { name: "Mar", projects: 98, revenue: 20 },
                      { name: "Apr", projects: 39, revenue: 27 },
                      { name: "May", projects: 48, revenue: 18 },
                      { name: "Jun", projects: 38, revenue: 23 },
                    ]}
                    margin={{ top: 0, right: 5, left: 0, bottom: 0 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" tick={{ fontSize: 9 }} />
                    <YAxis tick={{ fontSize: 9 }} />
                    <Tooltip />
                    <Legend wrapperStyle={{ fontSize: 9 }} />
                    <Bar
                      dataKey="projects"
                      stackId="a"
                      fill="#8884d8"
                      barSize={16}
                    />
                    <Bar
                      dataKey="revenue"
                      stackId="a"
                      fill="#82ca9d"
                      barSize={16}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
          */}
        </main>
      </div>
    </div>
  );
}
