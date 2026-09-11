# Logos

Drop square images here and reference them from `content/portfolio.yaml` as
`logo: /logos/<file>`.

Any entry that declares a `logo:` renders an avatar slot. Until the file
exists the slot shows the entry's initials — the build prints a warning and
never prerenders a broken `<img>`, so missing files are safe.

Square crops around 128×128 work best; PNG with transparency for company marks.
