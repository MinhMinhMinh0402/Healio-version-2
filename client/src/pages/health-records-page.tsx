import { SidebarNav } from "@/components/sidebar-nav";
import { useAuth } from "@/hooks/use-auth";
import { useQuery, useMutation } from "@tanstack/react-query";
import { FileText, Plus, Loader2 } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertHealthRecordSchema, type HealthRecord } from "@shared/schema";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";

export default function HealthRecordsPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isOpen, setIsOpen] = useState(false);

  const { data: records, isLoading } = useQuery<HealthRecord[]>({
    queryKey: ["/api/health-records", user?.id],
    queryFn: async () => {
      const res = await fetch(`/api/health-records/${user?.id}`);
      return res.json();
    },
  });

  const form = useForm({
    resolver: zodResolver(insertHealthRecordSchema),
    defaultValues: {
      userId: user?.id,
      diagnosis: "",
      doctor: "",
      date: new Date().toISOString().split('T')[0],
    },
  });

  const createRecord = useMutation({
    mutationFn: async (data: any) => {
      const res = await apiRequest("POST", "/api/health-records", data);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/health-records", user?.id] });
      setIsOpen(false);
      toast({
        title: "Success",
        description: "Health record added successfully",
      });
    },
  });

  return (
    <div className="flex h-screen bg-gray-50">
      <SidebarNav />
      
      <main className="flex-1 overflow-y-auto p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Health Records</h1>
          <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Add Record
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add Health Record</DialogTitle>
              </DialogHeader>
              <Form {...form}>
                <form onSubmit={form.handleSubmit((data) => createRecord.mutate(data))} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="diagnosis"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Diagnosis</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="doctor"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Doctor</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="date"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Date</FormLabel>
                        <FormControl>
                          <Input type="date" {...field} />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <Button type="submit" className="w-full" disabled={createRecord.isPending}>
                    {createRecord.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Add Record
                  </Button>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <Loader2 className="h-8 w-8 animate-spin" />
          </div>
        ) : records?.length === 0 ? (
          <div className="text-center text-gray-500 mt-8">
            No health records found
          </div>
        ) : (
          <div className="space-y-4">
            {records?.map((record) => (
              <div
                key={record.id}
                className="bg-white p-4 rounded-lg shadow flex items-start gap-4"
              >
                <FileText className="h-5 w-5 text-primary mt-1" />
                <div className="flex-1">
                  <div className="flex justify-between">
                    <h3 className="font-medium">{record.diagnosis}</h3>
                    <p className="text-sm text-gray-500">{record.date}</p>
                  </div>
                  <p className="text-sm text-gray-500">Dr. {record.doctor}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
