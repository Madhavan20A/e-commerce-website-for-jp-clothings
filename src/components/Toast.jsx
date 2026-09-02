import { CheckCircle2, AlertCircle, Info, X } from "lucide-react";
import { COLORS } from "../constants";

export default function Toast({ toast, onClose }) {
    if (!toast) return null;

    const bgMap = {
        success: COLORS.greenSuccess,
        error: COLORS.redError,
        info: COLORS.bgElevated,
    };

    const iconMap = {
        success: <CheckCircle2 size={18} color="#fff" />,
        error: <AlertCircle size={18} color="#fff" />,
        info: <Info size={18} color={COLORS.goldLight} />,
    };

    return (
        <div
            style={{
                position: "fixed",
                bottom: 24,
                right: 24,
                zIndex: 9999,
                background: bgMap[toast.type] || COLORS.bgElevated,
                color: "#fff",
                padding: "12px 18px",
                borderRadius: 6,
                display: "flex",
                alignItems: "center",
                gap: 12,
                boxShadow: "0 10px 30px rgba(0,0,0,0.5)",
                border: `1px solid ${COLORS.line}`,
                maxWidth: 360,
                animation: "slideIn 0.3s ease-out",
            }}
        >
            <style>{`
        @keyframes slideIn {
          from { transform: translateY(100%); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
      `}</style>
            {iconMap[toast.type]}
            <span style={{ fontSize: 13.5, fontFamily: "'Jost', sans-serif", flex: 1 }}>{toast.message}</span>
            <button
                onClick={onClose}
                style={{ background: "none", border: "none", color: "#fff", cursor: "pointer", padding: 0, display: "flex" }}
            >
                <X size={16} />
            </button>
        </div>
    );
}
