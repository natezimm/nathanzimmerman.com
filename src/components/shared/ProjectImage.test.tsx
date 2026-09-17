import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ProjectImage } from './ProjectImage';
import type { ProjectEntry } from '@/data/portfolioData';

describe('ProjectImage', () => {
  const mockProject: ProjectEntry = {
    slug: 'mock-game',
    title: 'MOCK GAME',
    subtitle: 'A Fun Mock Game',
    regionLabel: 'Mock Zone',
    summary: 'Mock game summary',
    description: 'Mock game full description',
    stack: ['React', 'TypeScript'],
    features: ['Feature 1', 'Feature 2'],
    links: { live: 'https://example.com' },
    image: '/assets/mock.webp',
    media: {
      webp: '/assets/mock.webp',
      webpSmall: '/assets/mock-small.webp',
      avif: '/assets/mock.avif',
      avifSmall: '/assets/mock-small.avif',
    },
    mediaBackground: 'light',
    accent: 'forest',
  };

  it('renders a picture with AVIF and WebP sources and fallback img', () => {
    const { container } = render(
      <ProjectImage project={mockProject} imgClassName="test-img" />
    );

    const picture = container.querySelector('picture');
    expect(picture).toBeInTheDocument();

    const avifSource = container.querySelector(
      'source[type="image/avif"]'
    ) as HTMLSourceElement | null;
    expect(avifSource).toBeInTheDocument();
    expect(avifSource?.srcset).toContain('/assets/mock-small.avif 600w');
    expect(avifSource?.srcset).toContain('/assets/mock.avif 1200w');

    const webpSource = container.querySelector(
      'source[type="image/webp"]'
    ) as HTMLSourceElement | null;
    expect(webpSource).toBeInTheDocument();
    expect(webpSource?.srcset).toContain('/assets/mock-small.webp 600w');
    expect(webpSource?.srcset).toContain('/assets/mock.webp 1200w');

    const img = screen.getByRole('img', { name: 'MOCK GAME screenshot' });
    expect(img).toBeInTheDocument();
    expect(img).toHaveAttribute('src', '/assets/mock.webp');
    expect(img).toHaveClass('test-img');
  });

  it('uses detail image and detail media when useDetail is true', () => {
    const mockWithDetail: ProjectEntry = {
      ...mockProject,
      detailImage: '/assets/mock-detail.webp',
      detailMedia: {
        webp: '/assets/mock-detail.webp',
        avif: '/assets/mock-detail.avif',
      },
    };

    const { container } = render(
      <ProjectImage project={mockWithDetail} useDetail />
    );

    const img = screen.getByRole('img', { name: 'MOCK GAME screenshot' });
    expect(img).toHaveAttribute('src', '/assets/mock-detail.webp');

    const avifSource = container.querySelector('source[type="image/avif"]');
    expect(avifSource).toHaveAttribute('srcset', '/assets/mock-detail.avif');
  });
});
