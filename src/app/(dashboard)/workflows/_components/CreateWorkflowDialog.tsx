"use client"
import CustomDialogHeader from "@/components/CustomDialogHeader";
import { Button } from "@/components/ui/button";
import { Dialog, DialogTrigger, DialogContent } from "@/components/ui/dialog";
import { createWorkflowSchema, createWorkflowSchemaType } from "@/schema/workflow";
import { Layers2Icon, Loader2, Loader2Icon } from "lucide-react";
import { z } from "zod"
import React, { useCallback, useState } from 'react'
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod"
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage
} from "@/components/ui/form"
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useMutation } from "@tanstack/react-query";
import { CreateWorkflow } from "@/actions/workflows/createWorkflow";
import { toast } from "sonner";


function CreateWorkflowDialog({ triggerText }: {
    triggerText?: string
}) {
    const [open, setOpen] = useState(false);

    const form = useForm<createWorkflowSchemaType>({
        resolver: zodResolver(createWorkflowSchema),
        defaultValues: {}
    })

    const { mutate, isPending } = useMutation({
        mutationFn: CreateWorkflow,
        onSuccess: () => {
            toast.success("Workflow created", { id: "create-workflow" })
        },
        onError: () => {
            toast.error("Failed to create workflow", { id: "create-workflow" })
        }
    })

    const onSubmit = useCallback((values: createWorkflowSchemaType) => {
        toast.loading("Creating workflow...", { id: "create-workflow" })
        mutate(values)
    }, [mutate])



    return (
        <Dialog open={open} onOpenChange={open => {
            form.reset();
            setOpen(open)
        }}>
            <DialogTrigger asChild>
                <Button>
                    {triggerText ?? "Create workflow"}
                </Button>
            </DialogTrigger>
            <DialogContent className="px-0">
                <CustomDialogHeader
                    icon={Layers2Icon}
                    title="Create workflow"
                    subTitle="Start building your workflow"
                />

                <div className="p-6">
                    <Form {...form}>
                        <form className="space-y-8 w-full" onSubmit={form.handleSubmit(onSubmit)}>
                            <FormField
                                control={form.control}
                                name="name"
                                render={({ field }) => (
                                    <FormItem >
                                        <FormLabel className="flex flex-1 gap-1 items-center">
                                            Name
                                            <p className="text-xs text-primary">*</p>
                                        </FormLabel>
                                        <FormControl>
                                            <Input {...field} />
                                        </FormControl>
                                        <FormDescription>
                                            Choose a descriptive and unique name
                                        </FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="description"
                                render={({ field }) => (
                                    <FormItem >
                                        <FormLabel className="flex flex-1 gap-1 items-center">
                                            Description
                                            <p className="text-xs text-muted-foreground">optional</p>
                                        </FormLabel>
                                        <FormControl>
                                            <Textarea className="resize-none" {...field} />
                                        </FormControl>
                                        <FormDescription>
                                            Provide a brief description of what your workflow does.
                                            This is optional but can help you remember the workflow&apos;s purpose
                                        </FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <Button disabled={isPending} type="submit" className="w-full">
                                {!isPending && "Proceed"}
                                {isPending && <Loader2 className="animate-spin" />}
                            </Button>
                        </form>
                    </Form>
                </div>
            </DialogContent>

        </Dialog>
    )
}

export default CreateWorkflowDialog