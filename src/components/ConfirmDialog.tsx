import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { TriangleAlert } from "lucide-react";

export function ConfirmDialog({
  open,
  onOpenChange,
  description,
  onConfirm,
}: {
  open: boolean;
  onOpenChange: (o: boolean) => void;
  description?: string;
  onConfirm: () => void;
}) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="max-w-sm rounded-3xl border-border bg-popover">
        <AlertDialogHeader className="items-center text-center sm:text-center">
          <span className="mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-destructive/10 text-destructive">
            <TriangleAlert className="h-5 w-5" />
          </span>
          <AlertDialogTitle className="font-display text-2xl font-normal">¿Seguro que deseas eliminar?</AlertDialogTitle>
          {description && <AlertDialogDescription>{description}</AlertDialogDescription>}
        </AlertDialogHeader>
        <AlertDialogFooter className="mt-2 grid grid-cols-2 gap-2 sm:space-x-0">
          <AlertDialogCancel className="m-0 rounded-full">Cancelar</AlertDialogCancel>
          <AlertDialogAction onClick={onConfirm} className="shine m-0 rounded-full bg-destructive text-destructive-foreground hover:bg-destructive/90">
            Sí, eliminar
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
