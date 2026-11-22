import { MarkdownPipe } from './markdown.pipe';

describe('MarkdownPipe', () => {
  it('renders Markdown lists as readable HTML', () => {
    const pipe = new MarkdownPipe();

    expect(pipe.transform('Low stock:\n\n- Widget')).toContain('<ul>');
    expect(pipe.transform('Low stock:\n\n- Widget')).toContain('<li>Widget</li>');
  });
});
