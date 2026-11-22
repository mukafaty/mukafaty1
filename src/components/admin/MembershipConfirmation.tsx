import { AlertDialog, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogFooter, AlertDialogCancel, AlertDialogAction } from "@/components/ui/alert-dialog";

export function MembershipConfirmation({ open, onOpenChange, onConfirm, name }: { open: boolean; onOpenChange: (open: boolean) => void; onConfirm: () => void; name: string }) {
  return <AlertDialog open={open} onOpenChange={onOpenChange}><AlertDialogContent dir="rtl">
    <AlertDialogHeader><AlertDialogTitle>إيقاف العضوية</AlertDialogTitle><AlertDialogDescription>هل تريد إيقاف عضوية {name}؟ يمكنك إعادة تفعيلها لاحقًا.</AlertDialogDescription></AlertDialogHeader>
    <AlertDialogFooter><AlertDialogCancel>إلغاء</AlertDialogCancel><AlertDialogAction className="bg-admin-red text-primary-foreground hover:bg-admin-red/90" onClick={onConfirm}>تأكيد الإيقاف</AlertDialogAction></AlertDialogFooter>
  </AlertDialogContent></AlertDialog>;
}