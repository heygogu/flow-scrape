import { DeleteWorkflow } from "@/actions/workflows/deleteWorkFlow";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Input } from "@/components/ui/input";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";

interface Props {
    open: boolean;
    setOpen: (open: boolean) => void;
    workflowName: string;
    workflowId: string;
}
export default function DeleteWorkflowDialog({ open, setOpen, workflowName, workflowId }: Props) {
    const [confirmText, setConfirmText] = useState("");

    const deleteMuatation = useMutation({
        mutationFn: DeleteWorkflow,
        onSuccess: () => {
            toast.success("Workflow deleted successfully", { id: workflowId })
            setConfirmText("")
        },
        onError: () => {
            toast.error("Something went wrong", { id: workflowId })
        }
    })

    return (
        <AlertDialog open={open} onOpenChange={setOpen} >
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                        This action cannot be undone. This will permanently delete your
                        workflow and remove it from our servers.

                        <div className="flex flex-col py-4 gap-2">
                            <p>
                                If you are sure, enter <b>{workflowName}</b> to confirm
                            </p>
                            <Input value={confirmText} onChange={(e) => setConfirmText(e.target.value)} />
                        </div>
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel onClick={() => setConfirmText("")}>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={(e) => {
                        e.stopPropagation()
                        toast.loading("Deleting workflow...", { id: workflowId })
                        deleteMuatation.mutate(workflowId)

                    }} className="bg-destructive text-destructive-foreground hover:bg-destructive/90 " disabled={confirmText !== workflowName || deleteMuatation.isPending}>
                        Delete
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}
