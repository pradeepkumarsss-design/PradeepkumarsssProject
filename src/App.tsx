import { useState } from "react";
import { EmployeeForm } from "./components/EmployeeForm";
import { ViewPage } from "./components/ViewPage";
import { ListPage } from "./components/ListPage";

export type Employee = {
  id: string;
  firstName: string;
  lastName: string;
  streetAddress: string;
  city: string;
  stateProvince: string;
  postalCode: string;
  country: string;
};

type Page = "list" | "form" | "view";

export default function App() {
  const [currentPage, setCurrentPage] = useState<Page>("list");
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [currentEmployee, setCurrentEmployee] = useState<Employee | null>(null);
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);

  const handleSaveEmployee = (employeeData: Omit<Employee, "id">) => {
    if (editingEmployee) {
      // Update existing employee
      const updatedEmployee = { ...employeeData, id: editingEmployee.id };
      setEmployees(employees.map(emp => emp.id === editingEmployee.id ? updatedEmployee : emp));
      setCurrentEmployee(updatedEmployee);
      setEditingEmployee(null);
    } else {
      // Add new employee
      const newEmployee = {
        ...employeeData,
        id: Date.now().toString(),
      };
      setEmployees([...employees, newEmployee]);
      setCurrentEmployee(newEmployee);
    }
    setCurrentPage("view");
  };

  const handleEdit = () => {
    if (currentEmployee) {
      setEditingEmployee(currentEmployee);
      setCurrentPage("form");
    }
  };

  const handleBackToList = () => {
    setCurrentEmployee(null);
    setEditingEmployee(null);
    setCurrentPage("list");
  };

  const handleAddNew = () => {
    setEditingEmployee(null);
    setCurrentEmployee(null);
    setCurrentPage("form");
  };

  const handleViewEmployee = (employee: Employee) => {
    setCurrentEmployee(employee);
    setCurrentPage("view");
  };

  const handleDeleteEmployee = (id: string) => {
    setEmployees(employees.filter(emp => emp.id !== id));
  };

  const handleBulkDeleteEmployees = (ids: string[]) => {
    setEmployees(employees.filter(emp => !ids.includes(emp.id)));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {currentPage === "form" && (
        <EmployeeForm 
          onSave={handleSaveEmployee}
          initialData={editingEmployee}
          onCancel={handleBackToList}
        />
      )}

      {currentPage === "view" && currentEmployee && (
        <ViewPage
          employee={currentEmployee}
          onEdit={handleEdit}
          onBack={handleBackToList}
        />
      )}

      {currentPage === "list" && (
        <ListPage
          employees={employees}
          onAdd={handleAddNew}
          onView={handleViewEmployee}
          onDelete={handleDeleteEmployee}
          onBulkDelete={handleBulkDeleteEmployees}
        />
      )}
    </div>
  );
}
