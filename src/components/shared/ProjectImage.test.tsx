import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ProjectImage } from './ProjectImage';

describe('ProjectImage', () => {
  const mockProject = {
    title: 'Mock Game',
    image: '/assets/mock.webp',
    media: {
      webp: '/assets/mock.webp',
      webpSmall: '/assets/mock-small.webp',
      avif: '/assets/mock.avif',
      avifSmall: '/assets/mock-small.avif',
    },
  };

  it('renders a picture with AVIF and WebP sources and a small fallback img', () => {
    const { container } = render(
      <ProjectImage project={mockProject} imgClassName="test-img" />
    );

    const avifSource = container.querySelector('source[type="image/avif"]');
    expect(avifSource).toHaveAttribute(
      'srcset',
      '/assets/mock-small.avif 600w, /assets/mock.avif 1200w'
    );

    const webpSource = container.querySelector('source[type="image/webp"]');
    expect(webpSource).toHaveAttribute(
      'srcset',
      '/assets/mock-small.webp 600w, /assets/mock.webp 1200w'
    );

    const img = screen.getByRole('img', { name: 'Mock Game screenshot' });
    expect(img).toHaveAttribute('src', '/assets/mock-small.webp');
    expect(img).toHaveClass('test-img');
  });

  it('uses single sources when there is no small size', () => {
    const { container } = render(
      <ProjectImage
        project={{
          ...mockProject,
          media: { webp: '/assets/mock.webp' },
        }}
      />
    );

    expect(container.querySelector('source[type="image/avif"]')).toBeNull();
    expect(
      container.querySelector('source[type="image/webp"]')
    ).toHaveAttribute('srcset', '/assets/mock.webp');
    expect(screen.getByRole('img')).toHaveAttribute('src', '/assets/mock.webp');
  });
});
