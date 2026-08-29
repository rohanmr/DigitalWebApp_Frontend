import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { toast } from "sonner";
import { mandalConfig } from "@/config/mandalConfig";

export function SettingsPage() {
  const [form, setForm] = useState({ ...mandalConfig });

  const handleChange = (field: keyof typeof form, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    toast.info("Preview only — settings aren't saved to the server yet.");
  };

  return (
    <div className="mx-auto max-w-2xl space-y-4 pb-6">
      <Alert className="border-amber-300 bg-amber-50 text-amber-900">
        <AlertDescription>
          This is a live preview of the receipt branding. There's no backend
          settings module yet, so nothing here is saved — changes reset on page
          refresh.
        </AlertDescription>
      </Alert>

      <Card className="border-none shadow-sm">
        <CardHeader>
          <CardTitle className="text-base">Mandal Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Mandal Name (Marathi)</Label>
            <Input
              className="h-11"
              value={form.nameMarathi}
              onChange={(e) => handleChange("nameMarathi", e.target.value)}
            />
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label>Location</Label>
              <Input
                className="h-11"
                value={form.location}
                onChange={(e) => handleChange("location", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>Established Year</Label>
              <Input
                className="h-11"
                value={form.establishedYear}
                onChange={(e) =>
                  handleChange("establishedYear", e.target.value)
                }
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label>Address</Label>
            <Input
              className="h-11"
              value={form.address}
              onChange={(e) => handleChange("address", e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label>Contact Number</Label>
            <Input
              className="h-11"
              value={form.contactNumber}
              onChange={(e) => handleChange("contactNumber", e.target.value)}
            />
          </div>
        </CardContent>
      </Card>

      <Card className="border-none shadow-sm">
        <CardHeader>
          <CardTitle className="text-base">Receipt Format</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Receipt Prefix</Label>
            <Input
              className="h-11"
              value={form.receiptPrefix}
              onChange={(e) => handleChange("receiptPrefix", e.target.value)}
            />
            <p className="text-xs text-muted-foreground">
              Note: receipt numbering logic lives on the backend (
              {form.receiptPrefix}-YYYY-0001) — changing this here won't affect
              actual generated numbers until the backend reads it too.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Live branding preview */}
      <Card className="border-2 border-[#c9a227]">
        <CardContent className="p-4 text-center">
          <p className="text-sm font-bold text-[#7a1f2b]">{form.nameMarathi}</p>
          <p className="text-xs text-muted-foreground">{form.location}</p>
          <p className="text-xs text-muted-foreground">
            स्थापना - {form.establishedYear}
          </p>
        </CardContent>
      </Card>

      <Button className="h-11 w-full sm:w-auto" onClick={handleSave}>
        Save Settings
      </Button>
    </div>
  );
}
