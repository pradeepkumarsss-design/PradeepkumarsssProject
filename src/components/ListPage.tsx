import { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Plus, User, Eye, Trash2 } from "lucide-react";
import type { Employee } from "../App";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "./ui/alert-dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";
import { Checkbox } from "./ui/checkbox";

type ListPageProps = {
  employees?: Employee[]; // Optional, since we fetch from API
  onAdd: () => void;
  onView: (employee: Employee) => void;
  onDelete: (id: string) => void;
  onBulkDelete: (ids: string[]) => void;
};

export function ListPage({ onAdd, onView, onDelete, onBulkDelete }: ListPageProps) {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const API_URL = "http://localhost:5000/employees";

  // ───────────────────────────────
  // FETCH EMPLOYEES ON PAGE LOAD
  // ───────────────────────────────
  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    try {
      const response = await fetch(API_URL);
      const data = await response.json();
      setEmployees(data);
    } catch (err) {
      console.error("Error fetching employees:", err);
    }
  };

  // ───────────────────────────────
  // DELETE SINGLE EMPLOYEE
  // ───────────────────────────────
  const handleDelete = async (id: string) => {
    try {
      await fetch(`${API_URL}/${id}`, { method: "DELETE" });
      setEmployees((prev) => prev.filter((emp) => emp._id !== id));
      onDelete(id); // optional callback for parent
    } catch (err) {
      console.error("Error deleting employee:", err);
    }
  };

  // ───────────────────────────────
  // BULK DELETE SELECTED EMPLOYEES
  // ───────────────────────────────
  const handleBulkDelete = async () => {
    try {
      await Promise.all(
        Array.from(selectedIds).map((id) =>
          fetch(`${API_URL}/${id}`, { method: "DELETE" })
        )
      );
      setEmployees((prev) => prev.filter((emp) => !selectedIds.has(emp._id || "")));
      setSelectedIds(new Set());
      setShowDeleteDialog(false);
      onBulkDelete(Array.from(selectedIds));
    } catch (err) {
      console.error("Error bulk deleting employees:", err);
    }
  };

  // ───────────────────────────────
  // SELECT HANDLERS
  // ───────────────────────────────
  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedIds(new Set(employees.map((emp) => emp._id || "")));
    } else {
      setSelectedIds(new Set());
    }
  };

  const handleSelectOne = (id: string, checked: boolean) => {
    const newSelected = new Set(selectedIds);
    if (checked) newSelected.add(id);
    else newSelected.delete(id);
    setSelectedIds(newSelected);
  };

  const allSelected = employees.length > 0 && selectedIds.size === employees.length;
  const someSelected = selectedIds.size > 0 && selectedIds.size < employees.length;

  // ───────────────────────────────
  // RENDER UI (UNCHANGED)
  // ───────────────────────────────
  return (
    <div className="min-h-screen p-4 py-8">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h1 className="text-slate-900 mb-2">Employee Details</h1>
              <p className="text-slate-600">
                {employees.length} {employees.length === 1 ? "employee" : "employees"} registered
                {selectedIds.size > 0 && (
                  <span className="ml-2 text-blue-600">
                    ({selectedIds.size} selected)
                  </span>
                )}
              </p>
            </div>
            <div className="flex gap-2">
              {selectedIds.size > 0 && (
                <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
                  <AlertDialogTrigger asChild>
                    <Button variant="destructive">
                      <Trash2 className="mr-2 h-4 w-4" />
                      Delete Selected ({selectedIds.size})
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Delete Employees</AlertDialogTitle>
                      <AlertDialogDescription>
                        Are you sure you want to delete {selectedIds.size}{" "}
                        {selectedIds.size === 1 ? "employee" : "employees"}? This action cannot be undone.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={handleBulkDelete}
                        className="bg-red-600 hover:bg-red-700"
                      >
                        Delete
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              )}
              <Button onClick={onAdd}>
                <Plus className="mr-2 h-4 w-4" />
                Add Employee
              </Button>
            </div>
          </div>

          {employees.length === 0 ? (
            <Card className="p-12 bg-slate-50 border-slate-200">
              <div className="text-center">
                <User className="h-12 w-12 text-slate-400 mx-auto mb-4" />
                <h3 className="text-slate-900 mb-2">No employees yet</h3>
                <p className="text-slate-600 mb-6">
                  Get started by adding your first employee
                </p>
                <Button onClick={onAdd}>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Employee
                </Button>
              </div>
            </Card>
          ) : (
            <div className="border rounded-lg overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-12">
                      <Checkbox
                        checked={allSelected}
                        onCheckedChange={handleSelectAll}
                        aria-label="Select all employees"
                        className={someSelected ? "data-[state=checked]:bg-blue-600" : ""}
                      />
                    </TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Street Address</TableHead>
                    <TableHead>City</TableHead>
                    <TableHead>State/Province</TableHead>
                    <TableHead>Postal Code</TableHead>
                    <TableHead>Country</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {employees.map((employee) => (
                    <TableRow
                      key={employee._id}
                      className={selectedIds.has(employee._id || "")
                        ? "bg-blue-50"
                        : "hover:bg-slate-50"}
                    >
                      <TableCell>
                        <Checkbox
                          checked={selectedIds.has(employee._id || "")}
                          onCheckedChange={(checked) =>
                            handleSelectOne(employee._id || "", checked as boolean)
                          }
                          aria-label={`Select ${employee.firstName} ${employee.lastName}`}
                        />
                      </TableCell>
                      <TableCell>
                        {employee.firstName} {employee.lastName}
                      </TableCell>
                      <TableCell>{employee.streetAddress}</TableCell>
                      <TableCell>{employee.city}</TableCell>
                      <TableCell>{employee.stateProvince}</TableCell>
                      <TableCell>{employee.postalCode}</TableCell>
                      <TableCell>{employee.country}</TableCell>
                      <TableCell>
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => onView(employee)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="text-red-600 hover:text-red-700 hover:bg-red-50"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Delete Employee</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Are you sure you want to delete {employee.firstName}{" "}
                                  {employee.lastName}? This action cannot be undone.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() => handleDelete(employee._id || "")}
                                  className="bg-red-600 hover:bg-red-700"
                                >
                                  Delete
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
