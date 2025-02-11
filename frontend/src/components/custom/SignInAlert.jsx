import { useRouter } from "next/navigation";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export default function SignInAlert() {
  const router = useRouter();

  return (
    <AlertDialog open>
      <AlertDialogContent className="border-4 border-teal-600 rounded-lg">
        <AlertDialogHeader className="px-3">
          <AlertDialogTitle className="text-xl">
            You were Signed Out
          </AlertDialogTitle>
          <AlertDialogDescription className="text-md">
            Please Sign In Again.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogAction onClick={() => router.push("/")}>
            CLose
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
