"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";

import { ProfileForm, type ProfileDraft } from "./profile-form";

export function EditProfile({ profile }: { profile?: ProfileDraft }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button
        variant={profile ? "secondary" : "primary"}
        onClick={() => setOpen(true)}
      >
        {profile ? "Editar" : "Criar perfil"}
      </Button>

      {open && (
        <Modal
          open
          onClose={() => setOpen(false)}
          title={profile ? "Editar perfil" : "Criar perfil"}
        >
          <ProfileForm profile={profile} onClose={() => setOpen(false)} />
        </Modal>
      )}
    </>
  );
}
