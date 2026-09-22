export default function Button({ children, disabled, onClick }: { children: React.ReactNode; disabled?: boolean; onClick?: () => void }) {
  return (
    <button
      className="bg-[#ec3750] text-white rounded-full group relative contain-content flex items-center px-6 py-2.5 mt-4 hover:saturate-90 disabled:opacity-50 disabled:cursor-not-allowed transition-all cursor-pointer border-b-4 border-r-4 border-rose-950"
      onClick={onClick}
      disabled={disabled ? true : false} 
    >
      {children}
      <span className="absolute text-2xl translate-x-35 group-hover:-translate-x-15 group-hover:rotate-180 transition duration-1000">🙏</span>
      <span className="absolute text-2xl translate-x-35 group-hover:-translate-x-15 group-hover:rotate-180 transition duration-1250">🤠</span>
      <span className="absolute text-2xl translate-x-35 group-hover:-translate-x-15 group-hover:rotate-180 transition duration-1500">🕷️</span>
    </button>
  );
}