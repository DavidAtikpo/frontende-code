declare module 'next/navigation' {
  export function usePathname(): string;
  export function useRouter(): {
    push: (url: string) => void;
    replace: (url: string) => void;
    back: () => void;
  };

  export function useParams(): {
    [key: string]: string;
  };
}

declare module 'next/server' {
  export class NextResponse extends Response {
    static redirect(url: string | URL): NextResponse;
    static next(): NextResponse;
    static json<T = unknown>(data: T): NextResponse;
  }

  export interface NextRequest extends Request {
    cookies: {
      get: (name: string) => { value: string } | undefined;
    };
    nextUrl: URL;
  }
}

declare module 'next/image' {
  import { DetailedHTMLProps, ImgHTMLAttributes } from 'react';
  
  interface ImageProps extends DetailedHTMLProps<ImgHTMLAttributes<HTMLImageElement>, HTMLImageElement> {
    src: string;
    alt: string;
    width?: number;
    height?: number;
    priority?: boolean;
  }

  const Image: React.FC<ImageProps>;
  export default Image;
} 

interface PageProps<T = Record<string, unknown>> {
  params: T;
} 