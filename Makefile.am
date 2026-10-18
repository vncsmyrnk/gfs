extensiondir = $(datadir)/gnome-shell/extensions/gfs@vncsmyrnk.dev
EXTRA_DIST = extension.ts lib/picker.ts metadata.json tsconfig.json package.json package-lock.json schemas/org.gnome.shell.extensions.gfs.gschema.xml

all-local: extension.js schemas/gschemas.compiled

nobase_dist_extension_DATA = extension.js metadata.json
CLEANFILES = extension.js lib/picker.js

extension.js: extension.ts lib/picker.ts tsconfig.json
	$(AM_V_GEN) $(NPM) install --silent
	$(AM_V_GEN) $(NPM) run build

gsettingsschemadir = $(extensiondir)/schemas
gsettings_SCHEMAS = schemas/org.gnome.shell.extensions.gfs.gschema.xml

schema_XML = schemas/org.gnome.shell.extensions.gfs.gschema.xml
EXTRA_DIST += $(schema_XML)

schemas/gschemas.compiled: $(gsettings_SCHEMAS)
	$(AM_V_GEN)$(MKDIR_P) schemas && \
		glib-compile-schemas schemas

nobase_dist_extension_DATA += schemas/gschemas.compiled
CLEANFILES += schemas/gschemas.compiled

@GSETTINGS_RULES@
