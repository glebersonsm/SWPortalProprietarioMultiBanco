import { useRouter } from "next/navigation";

export default function useCloseModal(url?: string) {
  const router = useRouter();

  const closeModal = () => (url ? router.push(url) : router.back());
  return closeModal;
}
