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

function ErrorAlert({ error }) {
  const router = useRouter();

  return (
    <AlertDialog open>
      <AlertDialogContent className="border-4 border-teal-600 rounded-lg">
        <AlertDialogHeader className="px-3">
          <AlertDialogTitle className="text-xl text-red-600">
            Error
          </AlertDialogTitle>
          <AlertDialogDescription className="text-md">
            {error.message}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogAction onClick={() => router.push("/")}>
            Close
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

function SignInAlert() {
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
            Close
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

function TicketCancelledAlert({ ticketId }) {
  const router = useRouter();

  return (
    <AlertDialog open>
      <AlertDialogContent className="border-4 border-teal-600 rounded-lg">
        <AlertDialogHeader className="px-3">
          <AlertDialogTitle className="text-2xl tracking-wider">
            Ticket Cancelled Successfully.
          </AlertDialogTitle>
          <AlertDialogDescription className="text-md tracking-wide">
            Ticket Id :<strong className="font-semibold "> {ticketId}</strong>
          </AlertDialogDescription>
          <AlertDialogDescription className="text-md tracking-wide">
            Your ticket has been cancelled successfully. Thank you for booking
            with Ticketo.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogAction onClick={() => router.push("/")}>
            <p className="tracking-wider">Close</p>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

function EventCreatedAlert() {
  const router = useRouter();

  return (
    <AlertDialog open>
      <AlertDialogContent className="border-4 border-teal-600 rounded-lg">
        <AlertDialogHeader className="px-3">
          <AlertDialogTitle className="text-3xl tracking-wider">
            Event Created Successfully.
          </AlertDialogTitle>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogAction onClick={() => router.push("/")}>
            <p className="tracking-wider">Close</p>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

function TicketBookedAlert({ isTicketSentViaEmail }) {
  const router = useRouter();

  return (
    <AlertDialog open>
      <AlertDialogContent className="border-4 border-teal-600 rounded-lg">
        <AlertDialogHeader className="px-3">
          <AlertDialogTitle className="text-2xl tracking-wider">
            Ticket Booked Successfully.
          </AlertDialogTitle>
          {isTicketSentViaEmail ? (
            <AlertDialogDescription className="text-md tracking-wide">
              Ticket sent to your email successfully.
            </AlertDialogDescription>
          ) : (
            <AlertDialogDescription className="text-md tracking-wide">
              <span className="text-red-600">Failed</span> to send ticket to
              your email.
            </AlertDialogDescription>
          )}
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogAction onClick={() => router.push("/")}>
            <p className="tracking-wider">Close</p>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

export {
  ErrorAlert,
  SignInAlert,
  TicketCancelledAlert,
  EventCreatedAlert,
  TicketBookedAlert,
};
