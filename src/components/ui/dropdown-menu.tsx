"use client";

import * as React from "react";
import * as DropdownMenuPrimitive from "@radix-ui/react-dropdown-menu";
import { Check, Chevron, Circle } from "@/components/icons";

import { cn } from "@/libraries/utils";

// Context for managing mobile submenu state
type MobileSubmenuContextType = {
  isMobile: boolean;
  activeSubmenu: string | null;
  setActiveSubmenu: (id: string | null) => void;
  submenuTitle: string;
  setSubmenuTitle: (title: string) => void;
};

const MobileSubmenuContext = React.createContext<MobileSubmenuContextType>({
  isMobile: false,
  activeSubmenu: null,
  setActiveSubmenu: () => {},
  submenuTitle: "",
  setSubmenuTitle: () => {},
});

// Hook to detect mobile devices
function useIsMobile(breakpoint: number = 768) {
  const [isMobile, setIsMobile] = React.useState(false);

  React.useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < breakpoint);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, [breakpoint]);

  return isMobile;
}

// Disable modal to prevent scrollbar from disappearing
const DropdownMenu = (
  props: React.ComponentProps<typeof DropdownMenuPrimitive.Root>
) => {
  const isMobile = useIsMobile();
  const [activeSubmenu, setActiveSubmenu] = React.useState<string | null>(null);
  const [submenuTitle, setSubmenuTitle] = React.useState("");

  return (
    <MobileSubmenuContext.Provider
      value={{
        isMobile,
        activeSubmenu,
        setActiveSubmenu,
        submenuTitle,
        setSubmenuTitle,
      }}
    >
      <DropdownMenuPrimitive.Root modal={false} {...props} />
    </MobileSubmenuContext.Provider>
  );
};

const DropdownMenuTrigger = DropdownMenuPrimitive.Trigger;

const DropdownMenuGroup = DropdownMenuPrimitive.Group;

const DropdownMenuPortal = DropdownMenuPrimitive.Portal;

const DropdownMenuSub = DropdownMenuPrimitive.Sub;

const DropdownMenuRadioGroup = DropdownMenuPrimitive.RadioGroup;

const DropdownMenuSubTrigger = React.forwardRef<
  React.ComponentRef<typeof DropdownMenuPrimitive.SubTrigger>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.SubTrigger> & {
    inset?: boolean;
    submenuId?: string;
    submenuTitle?: string;
  }
>(({ className, inset, children, submenuId, submenuTitle, ...props }, ref) => {
  const { isMobile, setActiveSubmenu, setSubmenuTitle } =
    React.useContext(MobileSubmenuContext);

  const handleClick = (e: React.MouseEvent) => {
    if (isMobile && submenuId) {
      e.preventDefault();
      e.stopPropagation();

      setSubmenuTitle(submenuTitle ?? "Back");
      setActiveSubmenu(submenuId);
    }
  };

  // On mobile, render as a button-like item instead of using SubTrigger
  if (isMobile) {
    return (
      <div
        role="menuitem"
        ref={ref}
        className={cn(
          "flex cursor-default gap-2 select-none items-center rounded-sm px-2 py-1.5 text-sm outline-hidden hover:bg-accent/10 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
          inset && "pl-8",
          className
        )}
        onClick={handleClick}
        {...props}
      >
        {children}
        <Chevron direction="right" className="ml-auto" />
      </div>
    );
  }

  // On desktop, use normal SubTrigger (without submenuId prop)
  return (
    <DropdownMenuPrimitive.SubTrigger
      ref={ref}
      className={cn(
        "flex cursor-default gap-2 select-none items-center rounded-sm px-2 py-1.5 text-sm outline-hidden focus:bg-accent/10 data-[state=open]:bg-accent/10 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
        inset && "pl-8",
        className
      )}
      {...props}
    >
      {children}
      <Chevron direction="right" className="ml-auto" />
    </DropdownMenuPrimitive.SubTrigger>
  );
});
DropdownMenuSubTrigger.displayName =
  DropdownMenuPrimitive.SubTrigger.displayName;

const DropdownMenuSubContent = React.forwardRef<
  React.ComponentRef<typeof DropdownMenuPrimitive.SubContent>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.SubContent> & {
    submenuId?: string;
  }
>(({ className, submenuId: _submenuId, children, ...props }, ref) => {
  const { isMobile } = React.useContext(MobileSubmenuContext);

  // On mobile, don't render in portal - it will be rendered by DropdownMenuContent
  if (isMobile) return null;

  // On desktop, render normally (without submenuId prop)
  return (
    <DropdownMenuPrimitive.SubContent
      ref={ref}
      className={cn(
        "z-50 min-w-[128px] overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-lg data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
        className
      )}
      {...props}
    >
      {children}
    </DropdownMenuPrimitive.SubContent>
  );
});
DropdownMenuSubContent.displayName =
  DropdownMenuPrimitive.SubContent.displayName;

const DropdownMenuContent = React.forwardRef<
  React.ComponentRef<typeof DropdownMenuPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Content> & {
    disablePortal?: boolean;
    darkBackButton?: boolean;
  }
>(
  (
    { className, sideOffset = 4, disablePortal = false, darkBackButton = false, children, ...props },
    ref
  ) => {
    const { isMobile, activeSubmenu, setActiveSubmenu, submenuTitle } =
      React.useContext(MobileSubmenuContext);

    // Extract submenu content for mobile rendering
    const submenuContents = (() => {
      const contents: Record<string, React.ReactNode> = {};

      const extractSubmenus = (node: React.ReactNode): void => {
        React.Children.forEach(node, (child) => {
          if (React.isValidElement(child)) {
            // Check if this is a DropdownMenuSub
            if (child.type === DropdownMenuSub) {
              let submenuId: string | undefined;
              let submenuContent: React.ReactNode;

              const childProps = child.props as { children?: React.ReactNode };
              React.Children.forEach(childProps.children, (subChild) => {
                if (React.isValidElement(subChild)) {
                  const { submenuId: id, children: content } =
                    subChild.props as {
                      submenuId?: string;
                      children?: React.ReactNode;
                    };

                  if (subChild.type === DropdownMenuSubTrigger) submenuId = id;
                  if (subChild.type === DropdownMenuSubContent)
                    submenuContent = content;
                }
              });

              if (submenuId && submenuContent) {
                contents[submenuId] = submenuContent;
              }
            }

            // Recursively check children
            const props = child.props as { children?: React.ReactNode };
            if (props.children) extractSubmenus(props.children);
          }
        });
      };

      extractSubmenus(children);
      return contents;
    })();

    const content = (
      <DropdownMenuPrimitive.Content
        ref={ref}
        sideOffset={sideOffset}
        className={cn(
          "z-50 min-w-[128px] overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-md",
          "data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
          className
        )}
        {...props}
      >
        {isMobile && activeSubmenu ? (
          <div className="flex flex-col">
            {/* Back button */}
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setActiveSubmenu(null);
              }}
              className={cn(
                "flex cursor-default select-none items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-hidden transition-colors sticky top-0 z-10 bg-inherit",
                darkBackButton
                  ? "hover:bg-accent-dark/10 hover:text-foreground-dark"
                  : "hover:bg-accent/10 hover:text-accent-foreground"
              )}
            >
              <Chevron direction="left" className="size-4 shrink-0" />
              <span>{submenuTitle}</span>
            </button>

            <span className="h-px bg-muted-foreground/20 my-1" />

            {/* Submenu items */}
            <div className="flex flex-col">
              {submenuContents[activeSubmenu]}
            </div>
          </div>
        ) : (
          children
        )}
      </DropdownMenuPrimitive.Content>
    );

    return disablePortal ? (
      content
    ) : (
      <DropdownMenuPrimitive.Portal>{content}</DropdownMenuPrimitive.Portal>
    );
  }
);
DropdownMenuContent.displayName = DropdownMenuPrimitive.Content.displayName;

const DropdownMenuItem = React.forwardRef<
  React.ComponentRef<typeof DropdownMenuPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Item> & {
    inset?: boolean;
  }
>(({ className, inset, ...props }, ref) => (
  <DropdownMenuPrimitive.Item
    ref={ref}
    className={cn(
      "relative flex cursor-default select-none items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-hidden transition-colors focus:bg-accent/10 focus:text-accent-foreground data-disabled:pointer-events-none data-disabled:opacity-50 [&>svg]:size-4 [&>svg]:shrink-0",
      inset && "pl-8",
      className
    )}
    {...props}
  />
));
DropdownMenuItem.displayName = DropdownMenuPrimitive.Item.displayName;

const DropdownMenuCheckboxItem = React.forwardRef<
  React.ComponentRef<typeof DropdownMenuPrimitive.CheckboxItem>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.CheckboxItem>
>(({ className, children, checked, ...props }, ref) => (
  <DropdownMenuPrimitive.CheckboxItem
    ref={ref}
    className={cn(
      "relative flex cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-hidden transition-colors focus:bg-accent/10 focus:text-accent-foreground data-disabled:pointer-events-none data-disabled:opacity-50",
      className
    )}
    checked={checked}
    {...props}
  >
    <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
      <DropdownMenuPrimitive.ItemIndicator>
        <Check className="h-4 w-4" />
      </DropdownMenuPrimitive.ItemIndicator>
    </span>
    {children}
  </DropdownMenuPrimitive.CheckboxItem>
));
DropdownMenuCheckboxItem.displayName =
  DropdownMenuPrimitive.CheckboxItem.displayName;

const DropdownMenuRadioItem = React.forwardRef<
  React.ComponentRef<typeof DropdownMenuPrimitive.RadioItem>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.RadioItem>
>(({ className, children, ...props }, ref) => (
  <DropdownMenuPrimitive.RadioItem
    ref={ref}
    className={cn(
      "relative flex cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-hidden transition-colors focus:bg-accent/10 focus:text-accent-foreground data-disabled:pointer-events-none data-disabled:opacity-50",
      className
    )}
    {...props}
  >
    <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
      <DropdownMenuPrimitive.ItemIndicator>
        <Circle className="h-2 w-2 fill-current" />
      </DropdownMenuPrimitive.ItemIndicator>
    </span>
    {children}
  </DropdownMenuPrimitive.RadioItem>
));
DropdownMenuRadioItem.displayName = DropdownMenuPrimitive.RadioItem.displayName;

const DropdownMenuLabel = React.forwardRef<
  React.ComponentRef<typeof DropdownMenuPrimitive.Label>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Label> & {
    inset?: boolean;
  }
>(({ className, inset, ...props }, ref) => (
  <DropdownMenuPrimitive.Label
    ref={ref}
    className={cn(
      "px-2 py-1.5 text-sm font-semibold",
      inset && "pl-8",
      className
    )}
    {...props}
  />
));
DropdownMenuLabel.displayName = DropdownMenuPrimitive.Label.displayName;

const DropdownMenuSeparator = React.forwardRef<
  React.ComponentRef<typeof DropdownMenuPrimitive.Separator>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Separator>
>(({ className, ...props }, ref) => (
  <DropdownMenuPrimitive.Separator
    ref={ref}
    className={cn("-mx-1 my-1 h-px bg-muted-foreground/20", className)}
    {...props}
  />
));
DropdownMenuSeparator.displayName = DropdownMenuPrimitive.Separator.displayName;

const DropdownMenuShortcut = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLSpanElement>) => {
  return (
    <span
      className={cn("ml-auto text-xs tracking-widest opacity-60", className)}
      {...props}
    />
  );
};
DropdownMenuShortcut.displayName = "DropdownMenuShortcut";

export {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuCheckboxItem,
  DropdownMenuRadioItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuGroup,
  DropdownMenuPortal,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuRadioGroup,
};
