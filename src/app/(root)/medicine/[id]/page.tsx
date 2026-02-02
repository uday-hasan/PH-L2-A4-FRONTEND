import MedicineDetailsPage from "@/features/medicine/components/MedicineDetailsPage";
import React from "react";

const page = async ({ params }: { params: Promise<{ id: string }> }) => {
  const id = (await params).id;
  return (
    <div>
      <MedicineDetailsPage medicineId={id} />
    </div>
  );
};

export default page;
