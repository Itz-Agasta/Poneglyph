"use client";

import { useState, useRef } from "react";
import { Button } from "@Poneglyph/ui/components/button";
import { Input } from "@Poneglyph/ui/components/input";
import { Textarea } from "@Poneglyph/ui/components/textarea";
import { Checkbox } from "@Poneglyph/ui/components/checkbox";
import { Label } from "@Poneglyph/ui/components/label";
import { Spinner } from "@Poneglyph/ui/components/spinner";
import { toast } from "sonner";
import type { VolunteerOwn } from "@/lib/types";
import { IconPlus, IconX } from "@tabler/icons-react";

interface VolunteerProfileFormProps {
  initialData: VolunteerOwn | null;
}

export function VolunteerProfileForm({ initialData }: VolunteerProfileFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [description, setDescription] = useState(initialData?.description || "");
  const [city, setCity] = useState(initialData?.city || "");
  const [bio, setBio] = useState(initialData?.bio || "");
  const [isOpenToWork, setIsOpenToWork] = useState(initialData?.isOpenToWork || false);
  const [wantsToStartOrg, setWantsToStartOrg] = useState(initialData?.wantsToStartOrg || false);
  const [pastWorks, setPastWorks] = useState<string[]>(initialData?.pastWorks || []);
  const [tagsInput, setTagsInput] = useState(
    initialData?.tags?.map((t) => t.slug).join(", ") || "",
  );
  const pastWorksInputRef = useRef<HTMLInputElement>(null);

  const handleAddPastWork = () => {
    const input = pastWorksInputRef.current;
    if (input && input.value.trim()) {
      setPastWorks([...pastWorks, input.value.trim()]);
      input.value = "";
    }
  };

  const handleRemovePastWork = (index: number) => {
    setPastWorks(pastWorks.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const tags = tagsInput
        .split(",")
        .map((t) => t.trim().toLowerCase())
        .filter(Boolean);

      const body = {
        description: description || undefined,
        city: city || undefined,
        bio: bio || undefined,
        pastWorks: pastWorks.length > 0 ? pastWorks : undefined,
        isOpenToWork,
        wantsToStartOrg,
        tags: tags.length > 0 ? tags : undefined,
      };

      const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/volunteer/me`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        const error = await res.text();
        toast.error("Failed to save profile");
        console.error(error);
        return;
      }

      toast.success("Profile saved successfully");
    } catch (err) {
      toast.error("Error saving profile");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Description */}
      <div className="space-y-2">
        <Label htmlFor="description">Short Description</Label>
        <Textarea
          id="description"
          placeholder="Brief description of yourself (max 500 chars)"
          value={description}
          onChange={(e) => setDescription(e.target.value.slice(0, 500))}
          maxLength={500}
          rows={3}
        />
        <p className="text-xs text-muted-foreground">{description.length}/500</p>
      </div>

      {/* City */}
      <div className="space-y-2">
        <Label htmlFor="city">City</Label>
        <Input
          id="city"
          placeholder="Your city"
          value={city}
          onChange={(e) => setCity(e.target.value.slice(0, 100))}
          maxLength={100}
        />
      </div>

      {/* Bio */}
      <div className="space-y-2">
        <Label htmlFor="bio">Bio</Label>
        <Textarea
          id="bio"
          placeholder="More detailed bio about yourself (max 2000 chars)"
          value={bio}
          onChange={(e) => setBio(e.target.value.slice(0, 2000))}
          maxLength={2000}
          rows={5}
        />
        <p className="text-xs text-muted-foreground">{bio.length}/2000</p>
      </div>

      {/* Past Works */}
      <div className="space-y-2">
        <Label>Past Works / Projects</Label>
        <div className="flex gap-2">
          <Input
            ref={pastWorksInputRef}
            placeholder="Add a past work or project"
            maxLength={200}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                handleAddPastWork();
              }
            }}
          />
          <Button type="button" onClick={handleAddPastWork} variant="outline" className="gap-2">
            <IconPlus className="w-4 h-4" />
            Add
          </Button>
        </div>
        {pastWorks.length > 0 && (
          <div className="space-y-2 mt-3">
            {pastWorks.map((work, idx) => (
              <div key={idx} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                <span className="text-sm">{work}</span>
                <button
                  type="button"
                  onClick={() => handleRemovePastWork(idx)}
                  className="p-1 hover:bg-background rounded"
                >
                  <IconX className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Tags */}
      <div className="space-y-2">
        <Label htmlFor="tags">Tags (comma-separated)</Label>
        <Input
          id="tags"
          placeholder="e.g., education, healthcare, environment"
          value={tagsInput}
          onChange={(e) => setTagsInput(e.target.value)}
        />
        <p className="text-xs text-muted-foreground">
          Enter tags separated by commas (max 10 tags)
        </p>
      </div>

      {/* Checkboxes */}
      <div className="space-y-3">
        <div className="flex items-center gap-3">
          <Checkbox
            id="openToWork"
            checked={isOpenToWork}
            onCheckedChange={(checked) => setIsOpenToWork(!!checked)}
          />
          <Label htmlFor="openToWork" className="cursor-pointer font-normal">
            Open to volunteer opportunities
          </Label>
        </div>
        <div className="flex items-center gap-3">
          <Checkbox
            id="wantsToStartOrg"
            checked={wantsToStartOrg}
            onCheckedChange={(checked) => setWantsToStartOrg(!!checked)}
          />
          <Label htmlFor="wantsToStartOrg" className="cursor-pointer font-normal">
            Interested in starting an organization
          </Label>
        </div>
      </div>

      {/* Submit */}
      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? (
          <>
            <Spinner className="w-4 h-4 mr-2" />
            Saving...
          </>
        ) : (
          "Save Profile"
        )}
      </Button>
    </form>
  );
}
