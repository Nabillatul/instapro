export function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(" ");
}

export function formatRupiah(amount: number): string {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatDate(date: string | Date): string {
  return new Intl.DateTimeFormat("id-ID", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(new Date(date));
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function truncate(text: string, length: number): string {
  if (text.length <= length) return text;
  return text.substring(0, length).trim() + "...";
}

export function getWhatsAppLink(message?: string): string {
  const phone = process.env.NEXT_PUBLIC_WA_NUMBER || "+628217710106";
  const cleanPhone = phone.replace(/\+/g, "");
  const encodedMessage = message ? encodeURIComponent(message) : "";
  return `https://wa.me/${cleanPhone}${encodedMessage ? `?text=${encodedMessage}` : ""}`;
}

export function renderMarkdown(md: string): string {
  if (!md) return "";
  
  // Escape HTML to prevent XSS (allowing basic tags we generate ourselves)
  let html = md
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");

  // Bold (**text**)
  html = html.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");

  // Italic (*text*)
  html = html.replace(/\*(.*?)\*/g, "<em>$1</em>");

  // Headers (### Header 3)
  html = html.replace(/^###[ \t]+(.*?)$/gm, "<h3>$1</h3>");
  // Headers (## Header 2)
  html = html.replace(/^##[ \t]+(.*?)$/gm, "<h2>$1</h2>");
  // Headers (# Header 1)
  html = html.replace(/^#[ \t]+(.*?)$/gm, "<h1>$1</h1>");

  // Convert inline or standalone "Penghargaan..." patterns into h2 subheadings
  html = html.replace(/(?:^|\n|\.\s+)(Penghargaan[^\n\.<]*)/gi, "\n<h2>$1</h2>\n");

  // Bullet points (- List item or * List item)
  html = html.replace(/^[-\*][ \t]+(.*?)$/gm, "<li>$1</li>");

  // Wrap contiguous <li> tags in <ul>
  const lines = html.split("\n");
  let inList = false;
  const processedLines = lines.map((line) => {
    const isLi = line.trim().startsWith("<li>");
    if (isLi && !inList) {
      inList = true;
      return "<ul>\n" + line;
    } else if (!isLi && inList) {
      inList = false;
      return "</ul>\n" + line;
    }
    return line;
  });
  if (inList) {
    processedLines.push("</ul>");
  }
  html = processedLines.join("\n");

  // Paragraphs: double newlines split paragraphs
  const blocks = html.split(/\n\s*\n/);
  const formattedBlocks = blocks.map((block) => {
    const trimmed = block.trim();
    if (!trimmed) return "";
    // If it's already a header, list, or list container, don't wrap in <p>
    if (
      trimmed.startsWith("<h") ||
      trimmed.startsWith("<ul") ||
      trimmed.startsWith("<li")
    ) {
      return trimmed;
    }
    return `<p>${trimmed.replace(/\n/g, "<br/>")}</p>`;
  });

  return formattedBlocks.filter(Boolean).join("\n");
}
