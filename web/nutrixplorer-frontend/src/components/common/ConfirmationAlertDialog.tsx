import {
    AlertDialog,
    AlertDialogTrigger,
    AlertDialogContent,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogCancel,
    AlertDialogAction,
} from "@/components/ui/alert-dialog";
import { FC } from "react";
import { Button } from "../ui/button";

type ConfirmationAlertDialogProps = {
    open: boolean;
    setOpen: () => void;
    onConfirm: () => void;
    title: string;
    content: string;
    confirmContent?: string;
    trigger?: boolean;
    children?: React.ReactNode;
};

const ConfirmationAlertDialog: FC<ConfirmationAlertDialogProps> = ({
    open,
    setOpen,
    onConfirm,
    title,
    content,
    confirmContent,
    children,
    trigger = true,
}) => {
    return (
        <AlertDialog open={open} onOpenChange={setOpen}>
            {trigger && (
                <AlertDialogTrigger asChild>
                    <Button className="flex gap-2" variant="ghost" onClick={() => setOpen()}>
                        {children}
                    </Button>
                </AlertDialogTrigger>
            )}
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>{title}</AlertDialogTitle>
                    <AlertDialogDescription>{content}</AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel onClick={() => setOpen()}>Anuluj</AlertDialogCancel>
                    <AlertDialogAction onClick={() => onConfirm()}>
                        {confirmContent || "Kontynuuj"}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
};

export default ConfirmationAlertDialog;
