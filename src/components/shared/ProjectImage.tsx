import type { ProjectEntry } from '@/data/portfolioData';

export type ProjectImageProps = {
  project: ProjectEntry;
  useDetail?: boolean;
  className?: string;
  imgClassName?: string;
  sizes?: string;
  loading?: 'lazy' | 'eager';
};

export const ProjectImage = ({
  project,
  useDetail = false,
  className,
  imgClassName,
  sizes = '(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 300px',
  loading = 'lazy',
}: ProjectImageProps) => {
  const media =
    useDetail && project.detailMedia ? project.detailMedia : project.media;
  const fallbackSrc =
    useDetail && project.detailImage ? project.detailImage : project.image;

  const avifSrcSet = media?.avif
    ? media.avifSmall
      ? `${media.avifSmall} 600w, ${media.avif} 1200w`
      : media.avif
    : undefined;

  const webpSrcSet = media?.webp
    ? media.webpSmall
      ? `${media.webpSmall} 600w, ${media.webp} 1200w`
      : media.webp
    : undefined;

  return (
    <picture className={className || undefined}>
      {avifSrcSet && (
        <source type="image/avif" srcSet={avifSrcSet} sizes={sizes} />
      )}
      {webpSrcSet && (
        <source type="image/webp" srcSet={webpSrcSet} sizes={sizes} />
      )}
      <img
        src={fallbackSrc}
        alt={`${project.title} screenshot`}
        className={imgClassName}
        loading={loading}
      />
    </picture>
  );
};

export default ProjectImage;
