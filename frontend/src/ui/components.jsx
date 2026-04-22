import "./ui.css";

export function Page({ children, className = "", ...props }) {
  return (
    <div className={["uiPage", className].filter(Boolean).join(" ")} {...props}>
      {children}
    </div>
  );
}

export function PageHeader({ title, subtitle, actions }) {
  return (
    <div className="uiHeader">
      <div className="uiTitle">
        <h2>{title}</h2>
        {subtitle ? <p>{subtitle}</p> : null}
      </div>
      {actions ? <div className="uiHeaderActions">{actions}</div> : null}
    </div>
  );
}

export function Card({ children, className = "", ...props }) {
  return (
    <div className={["uiCard", className].filter(Boolean).join(" ")} {...props}>
      {children}
    </div>
  );
}

export function CardBody({ children, className = "", ...props }) {
  return (
    <div
      className={["uiCardBody", className].filter(Boolean).join(" ")}
      {...props}
    >
      {children}
    </div>
  );
}

export function Row({ children, className = "", ...props }) {
  return (
    <div className={["uiRow", className].filter(Boolean).join(" ")} {...props}>
      {children}
    </div>
  );
}

export function Field({ label, children, hint }) {
  return (
    <div className="uiField">
      {label ? <div className="uiLabel">{label}</div> : null}
      {children}
      {hint ? <div className="uiHint">{hint}</div> : null}
    </div>
  );
}

export function Input(props) {
  const { className = "", ...rest } = props;
  return (
    <input
      className={["uiInput", className].filter(Boolean).join(" ")}
      {...rest}
    />
  );
}

export function Select(props) {
  const { className = "", ...rest } = props;
  return (
    <select
      className={["uiSelect", className].filter(Boolean).join(" ")}
      {...rest}
    />
  );
}

export function Textarea(props) {
  const { className = "", ...rest } = props;
  return (
    <textarea
      className={["uiTextarea", className].filter(Boolean).join(" ")}
      {...rest}
    />
  );
}

export function Button({ variant = "default", className = "", ...props }) {
  const cls = [
    "uiButton",
    variant === "primary" ? "uiButtonPrimary" : "",
    variant === "danger" ? "uiButtonDanger" : "",
    variant === "ghost" ? "uiButtonGhost" : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");
  return <button className={cls} {...props} />;
}

export function Badge({ variant = "default", children }) {
  const cls = [
    "uiBadge",
    variant === "success" ? "uiBadgeSuccess" : "",
    variant === "danger" ? "uiBadgeDanger" : "",
    variant === "warn" ? "uiBadgeWarn" : "",
  ]
    .filter(Boolean)
    .join(" ");
  return <span className={cls}>{children}</span>;
}

export function Divider() {
  return <div className="uiDivider" />;
}

export function Pagination({
  totalItems,
  page,
  pageSize,
  onPageChange,
  onPageSizeChange,
  pageSizeOptions = [6, 10, 20, 50],
  itemLabel = "kết quả",
}) {
  const safeTotal = Number.isFinite(totalItems) ? totalItems : 0;
  const safePageSize = Math.max(1, Number(pageSize) || 10);
  const pageCount = Math.max(1, Math.ceil(safeTotal / safePageSize));
  const safePage = Math.min(Math.max(1, Number(page) || 1), pageCount);

  const start = safeTotal === 0 ? 0 : (safePage - 1) * safePageSize + 1;
  const end = Math.min(safeTotal, safePage * safePageSize);

  const go = (p) => onPageChange?.(Math.min(Math.max(1, p), pageCount));

  return (
    <div className="uiPagination">
      <div className="uiPaginationLeft">
        <div className="uiPaginationMeta">
          {start}-{end} / {safeTotal} {itemLabel}
        </div>
      </div>

      <div className="uiPaginationRight">
        {Array.isArray(pageSizeOptions) &&
        pageSizeOptions.length > 1 &&
        typeof onPageSizeChange === "function" ? (
          <Select
            value={String(safePageSize)}
            onChange={(e) => onPageSizeChange(Number(e.target.value))}
            style={{ width: 110 }}
          >
            {pageSizeOptions.map((n) => (
              <option key={n} value={String(n)}>
                {n} / trang
              </option>
            ))}
          </Select>
        ) : null}

        <Button variant="ghost" onClick={() => go(1)} disabled={safePage <= 1}>
          «
        </Button>
        <Button
          variant="ghost"
          onClick={() => go(safePage - 1)}
          disabled={safePage <= 1}
        >
          ‹
        </Button>
        <div className="uiPaginationMeta">
          Trang {safePage}/{pageCount}
        </div>
        <Button
          variant="ghost"
          onClick={() => go(safePage + 1)}
          disabled={safePage >= pageCount}
        >
          ›
        </Button>
        <Button
          variant="ghost"
          onClick={() => go(pageCount)}
          disabled={safePage >= pageCount}
        >
          »
        </Button>
      </div>
    </div>
  );
}

