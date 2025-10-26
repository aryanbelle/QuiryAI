import { FormsService } from "./forms-service";
import { ResponsesService } from "./responses-service";
import { getSession, authService } from "./auth";
import { revalidatePath } from "next/cache";

export async function fetchUserForms() {
  const session = await authService.getCurrentUser();
  const userId = session?.userId;

  if (!userId) {
    return { forms: [], stats: { totalForms: 0, totalResponses: 0, totalViews: 0 } };
  }

  const forms = await FormsService.getUserForms(userId);
  const totalForms = forms.length;
  const totalResponses = forms.reduce((sum, form) => sum + form.responses, 0);
  const totalViews = forms.reduce((sum, form) => sum + form.views, 0);

  return { forms, stats: { totalForms, totalResponses, totalViews } };
}

export async function deleteForm(formId: string) {
  const session = await getSession();
  const userId = session?.userId;

  if (!userId) {
    throw new Error("User not authenticated.");
  }
  await FormsService.deleteForm(formId);
  revalidatePath("/dashboard");
}

export async function toggleFormActive(formId: string, isActive: boolean) {
  const session = await getSession();
  const userId = session?.userId;

  if (!userId) {
    throw new Error("User not authenticated.");
  }
  await FormsService.updateForm(formId, { isActive }, userId);
  revalidatePath("/dashboard");
}