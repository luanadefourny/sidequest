
export default function PasswordRequirements({ open, onClose, password }: { open: boolean, onClose: () => void, password: string }) {
  if (!open) return null;

  const requirements = [
    { label: "At least 8 characters", test: (pw: string) => pw.length >= 8 },
    { label: "One uppercase letter", test: (pw: string) => /[A-Z]/.test(pw) },
    { label: "One digit", test: (pw: string) => /[0-9]/.test(pw) },
    { label: "One symbol", test: (pw: string) => /[^A-Za-z0-9]/.test(pw) },
  ];

  return (
    <div className="fixed inset-0 bg-opacity-0 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-80 relative">
        <button className="absolute top-2 right-2 text-gray-500" onClick={onClose}>✕</button>
        <h2 className="text-lg font-bold mb-4">Password Requirements</h2>
        <ul className="space-y-2">
          {requirements.map((req, idx) => (
            <li key={idx} className={req.test(password) ? "text-green-600" : "text-red-600"}>
              {req.label}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}