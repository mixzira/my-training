import type { ReactNode, SVGProps } from "react";

import { cn } from "@/lib/cn";

export type IconProps = SVGProps<SVGSVGElement>;

function Icon({
  className,
  children,
  ...props
}: IconProps & { children: ReactNode }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
      focusable="false"
      className={cn("size-6 shrink-0", className)}
      {...props}
    >
      {children}
    </svg>
  );
}

export function HomeIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <path
        transform="translate(-1.7143 -2) scale(1.1429)"
        d="M4 19v-9q0-.475.213-.9t.587-.7l6-4.5q.525-.4 1.2-.4t1.2.4l6 4.5q.375.275.588.7T20 10v9q0 .825-.588 1.413T18 21h-3q-.425 0-.712-.288T14 20v-5q0-.425-.288-.712T13 14h-2q-.425 0-.712.288T10 15v5q0 .425-.288.713T9 21H6q-.825 0-1.412-.587T4 19"
      />
    </Icon>
  );
}

export function ExercisesIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <path
        transform="translate(1.4013 1.397) scale(0.424)"
        d="M17.96 44.87c.37.4.35 1.04-.05 1.42l-2.17 2.03c-.4.38-1.04.35-1.41-.05L1.68 34.64c-.37-.4-.35-1.04.05-1.42l2.17-2.03a.996.996 0 0 1 1.41.05zM34.1 19.22c.37.4.35 1.04-.05 1.42L20.38 33.41c-.4.38-1.04.35-1.41-.05l-3.26-3.52c-.37-.4-.35-1.04.05-1.42l13.67-12.77c.4-.37 1.04-.35 1.41.05l3.27 3.52zm-11.49 21.3c.37.4.35 1.04-.05 1.42l-2.17 2.03c-.4.38-1.04.35-1.41-.05L6.34 30.29c-.37-.4-.35-1.04.05-1.42l2.17-2.03c.4-.37 1.04-.35 1.41.05l12.65 13.63zm21.06-20.81c.37.4.35 1.04-.05 1.42l-2.17 2.03c-.4.38-1.04.35-1.41-.05L27.4 9.48c-.37-.4-.35-1.04.05-1.42l2.18-2.03c.4-.37 1.04-.35 1.41.05l12.64 13.63zm4.64-4.34c.37.4.35 1.04-.05 1.42l-2.17 2.03c-.4.38-1.04.35-1.41-.05L32.04 5.14c-.37-.4-.35-1.04.05-1.42l2.17-2.03a.997.997 0 0 1 1.41.05l12.64 13.64z"
      />
    </Icon>
  );
}

export function TrashIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M20 6a1 1 0 0 1 .117 1.993L20 8h-.081L19 19a3 3 0 0 1-2.824 2.995L16 22H8c-1.598 0-2.904-1.249-2.992-2.75l-.005-.167L4.08 8H4a1 1 0 0 1-.117-1.993L4 6zm-10 4a1 1 0 0 0-1 1v6a1 1 0 0 0 2 0v-6a1 1 0 0 0-1-1m4 0a1 1 0 0 0-1 1v6a1 1 0 0 0 2 0v-6a1 1 0 0 0-1-1m0-8a2 2 0 0 1 2 2a1 1 0 0 1-1.993.117L14 4h-4l-.007.117A1 1 0 0 1 8 4a2 2 0 0 1 1.85-1.995L10 2z" />
    </Icon>
  );
}

export function PencilIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <path
        transform="translate(-0.9493 -0.5009) scale(1.0604)"
        d="M18.58 2.944a2 2 0 0 0-2.828 0L14.107 4.59l5.303 5.303l1.645-1.644a2 2 0 0 0 0-2.829zm-.584 8.363l-5.303-5.303l-8.835 8.835l-1.076 6.38l6.38-1.077z"
      />
    </Icon>
  );
}

export function SettingsIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M14.647 4.081a.724.724 0 0 0 1.08.448c2.439-1.485 5.23 1.305 3.745 3.744a.724.724 0 0 0 .447 1.08c2.775.673 2.775 4.62 0 5.294a.724.724 0 0 0-.448 1.08c1.485 2.439-1.305 5.23-3.744 3.745a.724.724 0 0 0-1.08.447c-.673 2.775-4.62 2.775-5.294 0a.724.724 0 0 0-1.08-.448c-2.439 1.485-5.23-1.305-3.745-3.744a.724.724 0 0 0-.447-1.08c-2.775-.673-2.775-4.62 0-5.294a.724.724 0 0 0 .448-1.08c-1.485-2.439 1.305-5.23 3.744-3.745a.722.722 0 0 0 1.08-.447c.673-2.775 4.62-2.775 5.294 0M12 9a3 3 0 1 0 0 6a3 3 0 0 0 0-6" />
    </Icon>
  );
}

export function BackIcon({ className, ...props }: IconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 12 24"
      fill="currentColor"
      aria-hidden="true"
      focusable="false"
      className={cn("h-6 w-3 shrink-0", className)}
      {...props}
    >
      <path
        fillRule="evenodd"
        d="m3.343 12l7.071 7.071L9 20.485l-7.778-7.778a1 1 0 0 1 0-1.414L9 3.515l1.414 1.414z"
      />
    </svg>
  );
}
