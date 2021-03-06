var style = document.createElement( 'link' )
style.setAttribute( 'rel', 'stylesheet' )
style.setAttribute( 'href', import.meta.url.replace( '.js', '.css' ) )
document.getElementsByTagName( 'head' )[ 0 ].appendChild( style )

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

var _nextId = 100

var uniqueId = {
    computed: {
        id: function () {
            if ( !this.$uniqueId ) {
                _nextId += 1
                this.$uniqueId = 'id-' + _nextId
            }
            return this.$uniqueId
        }
    }
}

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

Vue.component( 'input-range', {
    mixins: [
        uniqueId
    ],
    template: `
        <div class="materialize range-field">
            <label v-bind:for="id"><slot></slot></label>
            <input v-bind:id="id" type="range"
                v-bind:value="value"
                v-bind:min="min"
                v-bind:max="max"
                v-bind:step="step"
                v-on:input="$emit( 'input', $event.target.value )"
            />
            <span><slot name="output">{{ value }}</slot></span>
        </div>
    `,
    props: [ 'value', 'min', 'max', 'step' ],
    mounted: function () {
    }
} )

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

Vue.component( 'input-spectrum', {
    mixins: [
        uniqueId
    ],
    template: `
        <div class="materialize input-spectrum">
            <label v-bind:for="id"><slot></slot></label>
            <input v-bind:id="id" type="text" ref="color">
            <span><slot name="output">{{ value }}</slot></span>
        </div>
    `,
    props: [ 'value' ],
    watch: {
        value: function ( val ) {
            $( this.$refs.color ).spectrum( 'set', val )
        }
    },
    mounted: function () {
        var self = this

        $( this.$refs.color ).spectrum( {
            color: this.value,
            // showInput: true, -- conflicts with materialized
            showButtons: false,
            showPaletteOnly: true,
            togglePaletteOnly: true,
            togglePaletteMoreText: 'More >>',
            togglePaletteLessText: '<< Less',
            hideAfterPaletteSelect:true,
            palette: [
                ["#000","#444","#666","#999","#ccc","#eee","#f3f3f3","#fff"],
                ["#f00","#f90","#ff0","#0f0","#0ff","#00f","#90f","#f0f"],
                ["#f4cccc","#fce5cd","#fff2cc","#d9ead3","#d0e0e3","#cfe2f3","#d9d2e9","#ead1dc"],
                ["#ea9999","#f9cb9c","#ffe599","#b6d7a8","#a2c4c9","#9fc5e8","#b4a7d6","#d5a6bd"],
                ["#e06666","#f6b26b","#ffd966","#93c47d","#76a5af","#6fa8dc","#8e7cc3","#c27ba0"],
                ["#c00","#e69138","#f1c232","#6aa84f","#45818e","#3d85c6","#674ea7","#a64d79"],
                ["#900","#b45f06","#bf9000","#38761d","#134f5c","#0b5394","#351c75","#741b47"],
                ["#600","#783f04","#7f6000","#274e13","#0c343d","#073763","#20124d","#4c1130"]
            ],
            change: function ( color ) {
                self.$emit( 'input', color.toName() || color.toHexString() )
            }
        } )
    }
} )

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

Vue.component( 'input-select', {
    mixins: [
        uniqueId
    ],
    template: `
        <div class="materialize input-field">
            <label v-bind:for="id" class="active"><slot></slot></label>
            <select v-bind:id="id" ref="select"
                v-bind:value="value"
                v-on:change.stop="$emit( 'input', $event.target.value )"
            >
                <slot name="options"></slot>
            </select>
        </div>
    `,
    props: [ 'value' ],
    created: function () {
        this.onUpdate = function () {
            M.FormSelect.init( this.$refs.select, {
                dropdownOptions: {
                    constrainWidth: false,
                    container: document.getElementsByTagName( 'body' )[ 0 ]
                }
            } )
        }
    },
    mounted: function () { this.onUpdate() },
    updated: function () { this.onUpdate() },
} )

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

Vue.component( 'input-text', {
    mixins: [
        uniqueId
    ],
    template: `
        <div class="materialize input-field">
            <label v-bind:for="id"><slot></slot></label>
            <input v-bind:id="id" type="text" ref="text"
                class="validate"
                v-bind:value="value"
                v-bind:disabled="disabled"
                v-on:input="$emit( 'input', $event.target.value )"
                v-bind:pattern="pattern"
                v-on:keyup.enter="$emit( 'keyEnter' )"
            />
            <span class="helper-text" v-if="$slots.helper || error || success"
                v-bind:data-error="error"
                v-bind:data-success="success"
            ><slot name="helper"></slot></span>
        </div>
    `,
    props: {
        value: [ String, Number ],
        hasFocus: Boolean,
        disabled: Boolean,
        pattern: String,
        error: String,
        success: String
    },
    watch: {
        hasFocus: function ( val ) {
            if ( val ) this.onUpdate()
        }
    },
    created: function () {
        this.onUpdate = function () {
            var self = this

            M.updateTextFields()
            if ( this.hasFocus )
                Vue.nextTick( function () { self.$refs.text.focus() } )
        }
    },
    mounted: function () { this.onUpdate() },
    updated: function () { this.onUpdate() },
} )

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

Vue.component( 'input-textarea', {
    mixins: [
        uniqueId
    ],
    template: `
        <div class="materialize input-field">
            <label v-bind:for="id"><slot></slot></label>
            <textarea v-bind:id="id" class="materialize-textarea" ref="text"
                v-bind:value="value"
                v-bind:disabled="disabled"
                v-on:input="$emit( 'input', $event.target.value )"
            ></textarea>
        </div>
    `,
    props: {
        value: String,
        hasFocus: Boolean,
        disabled: Boolean
    },
    watch: {
        hasFocus: function ( val ) {
            if ( val ) this.onUpdate()
        }
    },
    created: function () {
        this.onUpdate = function () {
            var self = this

            M.updateTextFields()
            M.textareaAutoResize( this.$refs.text )

            if ( this.hasFocus )
                Vue.nextTick( function () { self.$refs.text.focus() } )
        }
    },
    mounted: function () { this.onUpdate() },
    updated: function () { this.onUpdate() },
} )

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

Vue.component( 'input-checkbox', {
    template: `
        <div class="materialize">
            <label>
                <input type="checkbox" class="filled-in"
                    v-bind:checked="value"
                    v-on:change="$emit( 'input', $event.target.checked )"
                    v-bind:disabled="disabled"
                />
                <span><slot></slot></span>
            </label>
        </div>
    `,
    props: {
        value: Boolean,
        disabled: Boolean
    },
    mounted: function () {
    }
} )

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

Vue.component( 'input-toggle', {
    template: `
        <div class="materialize switch input-toggle">
            <div><slot></slot></div>
            <label>
                {{ off }}
                <input type="checkbox"
                    v-bind:checked="checked"
                    v-on:change="$emit( 'input', valueOut( $event.target.checked ) )"
                    v-bind:disabled="disabled"
                >
                <span class="lever"></span>
                {{ on }}
            </label>
        </div>
    `,
    props: {
        value: [ Boolean, String ],
        disabled: Boolean,
        on: String,
        off: String,
        onValue: String,
        offValue: String,
    },
    computed: {
        checked: function () {
            if ( this.onValue == null || this.offValue == null )
                return this.value

            return this.value == this.onValue ? true : this.value == this.offValue ? false : null
        }
    },
    methods: {
        valueOut: function ( checked ) {
            if ( this.onValue == null || this.offValue == null )
                return checked

            return checked ? this.onValue : this.offValue
        }
    },
    mounted: function () {
    }
} )

