extensiondir = $(datadir)/gnome-shell/extensions/gfs@vncsmyrnk.dev
EXTRA_DIST = extension.ts metadata.json tsconfig.json package.json package-lock.json schemas/org.gnome.shell.extensions.gfs.gschema.xml

all-local: extension.js schemas/gschemas.compiled

dist_extension_DATA = extension.js metadata.json
CLEANFILES = extension.js

extension.js: extension.ts tsconfig.json
	$(AM_V_GEN) $(NPM) install --silent
	$(AM_V_GEN) $(NPM) exec tsc

gsettingsschemadir = $(extensiondir)/schemas
gsettings_SCHEMAS = schemas/org.gnome.shell.extensions.gfs.gschema.xml

schema_XML = schemas/org.gnome.shell.extensions.gfs.gschema.xml
EXTRA_DIST += $(schema_XML)

CLEANFILES += schemas/gschemas.compiled

schemas/gschemas.compiled: $(gsettings_SCHEMAS)
	$(AM_V_GEN)$(MKDIR_P) schemas && \
		glib-compile-schemas schemas

@GSETTINGS_RULES@
