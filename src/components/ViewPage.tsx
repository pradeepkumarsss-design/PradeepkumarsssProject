import React, { useState } from "react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { User, MapPin, ArrowLeft, Edit, Save } from "lucide-react";

export function ViewPage({ employee, onBack }) {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState(employee);

  // Handle input changes while editing
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // PUT API call to update employee
  const handleSave = async () => {
    try {
      const response = await fetch(
        `http://localhost:5000/employees/${formData._id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        }
      );

      if (!response.ok) throw new Error("Failed to update employee");
      const result = await response.json();
      alert("✅ Employee updated successfully!");
      setFormData(result);
      setIsEditing(false);
    } catch (error) {
      console.error(error);
      alert("❌ Error updating employee");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="mb-6">
            <h1 className="text-slate-900 mb-2">Employee Details</h1>
            <p className="text-slate-600">View or edit employee information</p>
          </div>

          <Card className="p-6 bg-slate-50 border-slate-200 mb-6">
            <div className="space-y-6">
              {/* Name Section */}
              <div>
                <div className="flex items-center gap-2 mb-3 pb-2 border-b border-slate-300">
                  <User className="h-5 w-5 text-slate-600" />
                  <h3 className="text-slate-900">Personal Information</h3>
                </div>
                <div className="ml-7 grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-slate-600 text-sm mb-1">First Name</p>
                    {isEditing ? (
                      <input
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleChange}
                        className="border p-1 rounded w-full"
                      />
                    ) : (
                      <p className="text-slate-900">{formData.firstName}</p>
                    )}
                  </div>

                  <div>
                    <p className="text-slate-600 text-sm mb-1">Last Name</p>
                    {isEditing ? (
                      <input
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleChange}
                        className="border p-1 rounded w-full"
                      />
                    ) : (
                      <p className="text-slate-900">{formData.lastName}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Address Section */}
              <div>
                <div className="flex items-center gap-2 mb-3 pb-2 border-b border-slate-300">
                  <MapPin className="h-5 w-5 text-slate-600" />
                  <h3 className="text-slate-900">Address</h3>
                </div>
                <div className="ml-7 space-y-3">
                  <div>
                    <p className="text-slate-600 text-sm mb-1">Street Address</p>
                    {isEditing ? (
                      <input
                        name="streetAddress"
                        value={formData.streetAddress}
                        onChange={handleChange}
                        className="border p-1 rounded w-full"
                      />
                    ) : (
                      <p className="text-slate-900">{formData.streetAddress}</p>
                    )}
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-slate-600 text-sm mb-1">City</p>
                      {isEditing ? (
                        <input
                          name="city"
                          value={formData.city}
                          onChange={handleChange}
                          className="border p-1 rounded w-full"
                        />
                      ) : (
                        <p className="text-slate-900">{formData.city}</p>
                      )}
                    </div>
                    <div>
                      <p className="text-slate-600 text-sm mb-1">State/Province</p>
                      {isEditing ? (
                        <input
                          name="stateProvince"
                          value={formData.stateProvince}
                          onChange={handleChange}
                          className="border p-1 rounded w-full"
                        />
                      ) : (
                        <p className="text-slate-900">{formData.stateProvince}</p>
                      )}
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-slate-600 text-sm mb-1">Postal Code</p>
                      {isEditing ? (
                        <input
                          name="postalCode"
                          value={formData.postalCode}
                          onChange={handleChange}
                          className="border p-1 rounded w-full"
                        />
                      ) : (
                        <p className="text-slate-900">{formData.postalCode}</p>
                      )}
                    </div>
                    <div>
                      <p className="text-slate-600 text-sm mb-1">Country</p>
                      {isEditing ? (
                        <input
                          name="country"
                          value={formData.country}
                          onChange={handleChange}
                          className="border p-1 rounded w-full"
                        />
                      ) : (
                        <p className="text-slate-900">{formData.country}</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Card>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <Button variant="outline" onClick={onBack} className="flex-1">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back
            </Button>

            {isEditing ? (
              <Button onClick={handleSave} className="flex-1">
                <Save className="mr-2 h-4 w-4" />
                Update Employee
              </Button>
            ) : (
              <Button onClick={() => setIsEditing(true)} className="flex-1">
                <Edit className="mr-2 h-4 w-4" />
                Edit
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
