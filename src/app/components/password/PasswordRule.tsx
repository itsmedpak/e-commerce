import { cn } from "@/lib/utils"
import { Check, Circle } from "lucide-react"

interface PasswordRuleProps {
    passed: boolean
    text: string
}

export const PasswordRule = ({ passed, text }: PasswordRuleProps) => (
    <li className={cn(
            "flex items-center gap-2 text-xs transition-colors",
            passed ? "text-zinc-700" : "text-zinc-400"
        )}
    >
        <span aria-hidden
            className={cn(
                "flex size-4 items-center justify-center rounded-full transition-colors",
                passed ? "bg-emerald-100 text-emerald-700" : "bg-zinc-100 text-zinc-400"
            )}
        >
            {passed ? <Check className="size-2.5" strokeWidth={3} /> : <Circle className="size-2" />}
        </span>
        {text}
        <span className="sr-only">{passed ? "(met)" : "(not met)"}</span>
    </li>
)