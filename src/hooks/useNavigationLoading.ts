"use client";

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useLoading } from '@/contexts/LoadingContext';

export const useNavigationLoading = () => {
  const { setIsLoading, setLoadingMessage } = useLoading();
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    // Remove o loading quando a rota muda (navegação concluída)
    const timeoutId = setTimeout(() => {
      setIsLoading(false);
    }, 300); // Pequeno delay para permitir que a página carregue

    return () => {
      clearTimeout(timeoutId);
    };
  }, [pathname, setIsLoading]);

  const navigateWithLoading = (path: string, message: string = 'Carregando página...') => {
    setLoadingMessage(message);
    setIsLoading(true);
    
    // Pequeno delay para mostrar o loading antes da navegação
    setTimeout(() => {
      router.push(path);
      // O loading será removido pelo useEffect quando a rota mudar
    }, 100);
  };

  return {
    navigateWithLoading,
  };
};