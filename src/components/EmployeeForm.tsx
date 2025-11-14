import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { toast } from "sonner";
import { User, MapPin, X } from "lucide-react";
import type { Employee } from "../App";

const employeeSchema = z.object({
  firstName: z.string().min(2, "First name must be at least 2 characters"),
  lastName: z.string().min(2, "Last name must be at least 2 characters"),
  streetAddress: z.string().min(5, "Street address must be at least 5 characters"),
  city: z.string().min(2, "City must be at least 2 characters"),
  stateProvince: z.string().min(2, "State/Province must be at least 2 characters"),
  postalCode: z.string().min(3, "Postal code must be at least 3 characters"),
  country: z.string().min(2, "Country must be at least 2 characters"),
});

type EmployeeFormData = z.infer<typeof employeeSchema>;

type EmployeeFormProps = {
  onSave: (data: Employee) => void;
  initialData?: Employee | null;
  onCancel: () => void;
};

export function EmployeeForm({ onSave, initialData, onCancel }: EmployeeFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<EmployeeFormData>({
    resolver: zodResolver(employeeSchema),
    defaultValues: initialData || undefined,
  });

  const onSubmit = async (data: EmployeeFormData) => {
    try {
      // 🔹 POST to backend API
      const response = await fetch("http://localhost:5000/employees", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error("Failed to save employee");
      }

      const savedEmployee = await response.json();

      // 🔹 Call parent handler to update local list
      onSave(savedEmployee);

      toast.success("Employee details saved successfully!");
    } catch (error) {
      console.error("Error saving employee:", error);
      toast.error("Failed to save employee. Please try again.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h1 className="text-slate-900 mb-2">
                {initialData ? "Edit Employee Details" : "Employee Details"}
              </h1>
              <p className="text-slate-600">
                {initialData ? "Update the employee information below" : "Enter the employee information below"}
              </p>
            </div>
            <Button type="button" variant="ghost" size="icon" onClick={onCancel}>
              <X className="h-5 w-5" />
            </Button>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Name Section */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 pb-2 border-b border-slate-200">
                <User className="h-5 w-5 text-slate-600" />
                <h3 className="text-slate-900">Personal Information</h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">First Name</Label>
                  <Input id="firstName" placeholder="John" {...register("firstName")} />
                  {errors.firstName && <p className="text-red-500 text-sm">{errors.firstName.message}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input id="lastName" placeholder="Doe" {...register("lastName")} />
                  {errors.lastName && <p className="text-red-500 text-sm">{errors.lastName.message}</p>}
                </div>
              </div>
            </div>

            {/* Address Section */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 pb-2 border-b border-slate-200">
                <MapPin className="h-5 w-5 text-slate-600" />
                <h3 className="text-slate-900">Address</h3>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="streetAddress">Street Address</Label>
                  <Input id="streetAddress" placeholder="123 Main Street" {...register("streetAddress")} />
                  {errors.streetAddress && <p className="text-red-500 text-sm">{errors.streetAddress.message}</p>}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="city">City</Label>
                    <Input id="city" placeholder="New York" {...register("city")} />
                    {errors.city && <p className="text-red-500 text-sm">{errors.city.message}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="stateProvince">State/Province</Label>
                    <Input id="stateProvince" placeholder="NY" {...register("stateProvince")} />
                    {errors.stateProvince && <p className="text-red-500 text-sm">{errors.stateProvince.message}</p>}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="postalCode">Postal Code</Label>
                    <Input id="postalCode" placeholder="10001" {...register("postalCode")} />
                    {errors.postalCode && <p className="text-red-500 text-sm">{errors.postalCode.message}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="country">Country</Label>
                    <Input id="country" placeholder="United States" {...register("country")} />
                    {errors.country && <p className="text-red-500 text-sm">{errors.country.message}</p>}
                  </div>
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              <Button type="button" variant="outline" className="flex-1" onClick={onCancel}>
                Cancel
              </Button>
              <Button type="submit" className="flex-1" disabled={isSubmitting}>
                {isSubmitting ? "Saving..." : "Save Employee Details"}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
