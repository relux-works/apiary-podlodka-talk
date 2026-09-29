# Themes

Two local Slidev themes. Both come from the iOS Crew #18 deck (ivanopcode/ios-crew-18-rwb), where they were built and used on stage.

| Theme | Look | Guide | Showcase |
| --- | --- | --- | --- |
| `rwb-tech` | Corporate RWB template made consistent: dark ground `#161616`, grey cards, purple takeaway strips, purple part openers with 3D icons, pixel-square motif, logo and footer on every slide. | [`rwb-tech/STYLE.md`](rwb-tech/STYLE.md) | `npm run theme:rwb-tech` |
| `rwb-minimal` | The first, typographic style: near-black `#0B0D12`, no cards or page-wide fills, a thin purple bar on part openers, vector pixel motifs, a designed source line, logo only on the title and the final slide. | [`rwb-minimal/STYLE.md`](rwb-minimal/STYLE.md) | `npm run theme:rwb-minimal` |

## Choosing a theme

The deck names its theme in the headmatter of `slides/slides.md`:

```yaml
theme: ../themes/rwb-tech      # or ../themes/rwb-minimal
```

Both themes implement the same core, so a deck written with it renders in either:

- layouts `cover`, `section`, `statement`, `default`, `two-cols`, `code-side`, `demo`, `end`;
- frontmatter `tag` (footer part label), `num` (part or demo number), `class: dense`;
- classes `lead` (takeaway), `note`, `sec`, `small`;
- components `<BigNum>`, `<Boxes>`, `<Stack>`, `<Tag>`, `<PixelMotif>`;
- colour tokens `--rwb-bg`, `--rwb-txt`, `--rwb-sec`, `--rwb-lilac`, `--rwb-orange`, `--rwb-lime`, `--rwb-node`.

Each theme adds its own vocabulary on top: `rwb-tech` has `cards cols-N`, `card purple|lilac|lime|orange|big|num`, section `icon:`; `rwb-minimal` has `source:`, `<SourceNote>`, `<Ph>`. A slide that uses these needs rework when the theme changes.

## Logo

Both themes bundle the RWB logo. A deck overrides it in the headmatter:

```yaml
themeConfig:
  logo: false                  # no logo anywhere
  # logo: /brand/logo.svg      # a file from slides/public/
  # logoAlt: Relux Works
```

## Changing a theme

Edit it here and run `npm run verify` for the deck and `.scripts/verify.sh themes/<name>/example.md` for its showcase; CI runs all three. The plan is to move each theme into its own repository and install it as a package (`slidev-theme-<name>`); until then these copies are the source.
