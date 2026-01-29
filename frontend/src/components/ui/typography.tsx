import { cn } from "@/lib/utils"

export function TypographyH1({ className, children, ...props }: React.HTMLAttributes<HTMLHeadingElement>) {
    return (
        <h1
            className={cn(
                "scroll-m-20 text-center text-4xl font-extrabold tracking-tight text-balance",
                className
            )}
            {...props}
        >
            {children}
        </h1>
    )
}

export function TypographyH2({ className, children, ...props }: React.HTMLAttributes<HTMLHeadingElement>) {
    return (
        <h2
            className={cn(
                "scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight first:mt-0",
                className
            )}
            {...props}
        >
            {children}
        </h2>
    )
}

export function TypographyH3({ className, children, ...props }: React.HTMLAttributes<HTMLHeadingElement>) {
    return (
        <h3
            className={cn(
                "scroll-m-20 text-2xl font-semibold tracking-tight",
                className
            )}
            {...props}
        >
            {children}
        </h3>
    )
}

export function TypographyH4({ className, children, ...props }: React.HTMLAttributes<HTMLHeadingElement>) {
    return (
        <h4
            className={cn(
                "scroll-m-20 text-xl font-semibold tracking-tight",
                className
            )}
            {...props}
        >
            {children}
        </h4>
    )
}

export function TypographyP({ className, children, ...props }: React.HTMLAttributes<HTMLParagraphElement>) {
    return (
        <p
            className={cn("leading-7 [&:not(:first-child)]:mt-6", className)}
            {...props}
        >
            {children}
        </p>
    )
}

export function TypographyBlockquote({ className, children, ...props }: React.BlockquoteHTMLAttributes<HTMLQuoteElement>) {
    return (
        <blockquote
            className={cn("mt-6 border-l-2 pl-6 italic", className)}
            {...props}
        >
            {children}
        </blockquote>
    )
}

export function TypographyTable({ className, children, headers, rows, ...props }: React.HTMLAttributes<HTMLDivElement> & {
    headers: string[]
    rows: string[][]
}) {
    return (
        <div className={cn("my-6 w-full overflow-y-auto", className)} {...props}>
            <table className="w-full">
                <thead>
                    <tr className="m-0 border-t p-0 even:bg-muted">
                        {headers.map((header, i) => (
                            <th
                                key={i}
                                className="border px-4 py-2 text-left font-bold [&[align=center]]:text-center [&[align=right]]:text-right"
                            >
                                {header}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {rows.map((row, i) => (
                        <tr key={i} className="m-0 border-t p-0 even:bg-muted">
                            {row.map((cell, j) => (
                                <td
                                    key={j}
                                    className="border px-4 py-2 text-left [&[align=center]]:text-center [&[align=right]]:text-right"
                                >
                                    {cell}
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}

export function TypographyList({ className, children, items, ...props }: React.HTMLAttributes<HTMLUListElement> & {
    items?: string[]
}) {
    return (
        <ul className={cn("my-6 ml-6 list-disc [&>li]:mt-2", className)} {...props}>
            {items ? items.map((item, i) => <li key={i}>{item}</li>) : children}
        </ul>
    )
}

export function TypographyInlineCode({ className, children, ...props }: React.HTMLAttributes<HTMLElement>) {
    return (
        <code
            className={cn(
                "relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm font-semibold",
                className
            )}
            {...props}
        >
            {children}
        </code>
    )
}

export function TypographyLead({ className, children, ...props }: React.HTMLAttributes<HTMLParagraphElement>) {
    return (
        <p className={cn("text-xl text-muted-foreground", className)} {...props}>
            {children}
        </p>
    )
}

export function TypographyLarge({ className, children, ...props }: React.HTMLAttributes<HTMLDivElement>) {
    return (
        <div className={cn("text-lg font-semibold", className)} {...props}>
            {children}
        </div>
    )
}

export function TypographySmall({ className, children, ...props }: React.HTMLAttributes<HTMLElement>) {
    return (
        <small
            className={cn("text-sm font-medium leading-none", className)}
            {...props}
        >
            {children}
        </small>
    )
}

export function TypographyMuted({ className, children, ...props }: React.HTMLAttributes<HTMLParagraphElement>) {
    return (
        <p className={cn("text-sm text-muted-foreground", className)} {...props}>
            {children}
        </p>
    )
}
