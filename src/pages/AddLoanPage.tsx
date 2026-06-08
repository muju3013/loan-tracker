import { useNavigate } from "react-router-dom";
import { useAppStore } from "../hooks/useAppStore";
import { LoanForm } from "../components/LoanForm";

export function AddLoanPage() {
  const navigate = useNavigate();
  const { addLoan } = useAppStore();

  return (
    <div className="space-y-6 max-w-3xl">
      <h1 className="text-2xl font-bold">Add New Loan</h1>
      <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6 shadow-sm">
        <LoanForm
          onSubmit={async (input) => {
            await addLoan(input);
            navigate("/loans");
          }}
          onCancel={() => navigate(-1)}
        />
      </div>
    </div>
  );
}
