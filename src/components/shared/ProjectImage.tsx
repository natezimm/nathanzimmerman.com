import type { ProjectEntry } from '@/data/portfolioData';

export type ProjectImageProps = {
  project: Pick<ProjectEntry, 'title' | 'image' | 'media'>;
  className?: string;
  imgClassName?: string;
  sizes?: string;
  loading?: 'lazy' | 'eager';
  width?: number;
  height?: number;
};

const srcSet = (small: string | undefined, large: string | undefined) =>
  large ? (small ? `${small} 600w, ${large} 1200w` : large) : undefined;

export const ProjectImage = ({
  project,
  className,
  imgClassName,
  sizes = '(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 600px',
  loading = 'lazy',
  width,
  height,
}: ProjectImageProps) => {
  const { media } = project;
  const avifSrcSet = srcSet(media.avifSmall, media.avif);
  const webpSrcSet = srcSet(media.webpSmall, media.webp);

  return (
    <picture className={className || undefined}>
      {avifSrcSet && (
        <source type="image/avif" srcSet={avifSrcSet} sizes={sizes} />
      )}
      {webpSrcSet && (
        <source type="image/webp" srcSet={webpSrcSet} sizes={sizes} />
      )}
      <img
        src={media.webpSmall ?? project.image}
        alt={`${project.title} screenshot`}
        className={imgClassName}
        loading={loading}
        decoding="async"
        width={width}
        height={height}
      />
    </picture>
  );
};

export default ProjectImage;
