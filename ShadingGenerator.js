/**
 * ShadingGenerator
 */
var ShadingGenerator = {
    /**
     * Hexadecimal value of the color
     */
    colorHex: null,
    
    /**
     * Canal R for RGB color
     */
    colorR: null,
    
    /**
     * Canal G for RGB color
     */
    colorG: null,
    
    /**
     * Canal B for RGB color
     */
    colorB: null,
    
    colorIncrement: 10,
    
    /**
     * Initialize ShadingGenerator
     */
    initialize: function () {
        $('body').on('keyup', '#color-hex', this, function (el) {
            var value = $(this).val();
            if (el.data.hexIsValid(value)) {
                $(this).parent().removeClass('has-error');
                
                // Update value
                el.data.colorHex = el.data.formatHex(value);
                
                // Update RGB
                el.data.updateRgbFromHex();
                
                // Update preview
                el.data.updateColorPreview();
                
                // Update shadings
                el.data.updateShadings();
            }
            else {
                $(this).parent().addClass('has-error');
            }
        });
        
        $('body').on('keyup', '#color-r', this, function (el) {
            console.log('r');
        });

        $('body').on('keyup', '#color-g', this, function (el) {
            console.log('g');
        });
        
        $('body').on('keyup', '#color-b', this, function (el) {
            console.log('b');
        });
        
        $('body').on('click', '.shading-preview', this, function (el) {
            var value = $(this).find('input').val();
            if (el.data.hexIsValid(value)) {
                
                // Update value
                el.data.colorHex = el.data.formatHex(value);
                
                $('#color-hex').val(el.data.colorHex);
                
                // Update RGB
                el.data.updateRgbFromHex();
                
                // Update preview
                el.data.updateColorPreview();
                
                // Update shadings
                el.data.updateShadings();
            }
        });
        
    },
    
    hexIsValid: function (hex) {
        if (undefined !== hex && null !== hex && (hex.length === 3 || hex.length === 6)) {
            if (hex.length === 3) {
                // Process shorthand
                hex = this.formatHex(hex);
            }
            
            // Validate
            if (match = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)) {
                return true;
            }
        }
        
        return false;
    },
    
    rgbIsValid: function (canal) {
        if (null !== canal && '' !== canal) {
            // Check if value is an int 
            var intValue = parseInt(canal);
            if (intValue == canal) {
                // Check value is between 0 and 255
                if (0 <= intValue && 255 >= intValue) {
                    return true;
                }
            }
        }
        
        return false;
    },
    
    updateRgbFromHex: function () {
        var color = this.hexToRgb(this.colorHex);
        if (color) {
            this.colorR = color.r;
            this.colorG = color.g;
            this.colorB = color.b;
            
            $('#color-r').val(this.colorR);
            $('#color-g').val(this.colorG);
            $('#color-b').val(this.colorB);
        }
    },
    
    updateHexFromRgb: function () {
        
    },
    
    /**
     * Convert Hex color to RGB 
     */
    hexToRgb: function (hex) {
        var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result ? {
            r: parseInt(result[1], 16),
            g: parseInt(result[2], 16),
            b: parseInt(result[3], 16)
        } : null;
    },

    /**
     * Convert RGB color to Hex
     */
    hexToRgb: function (hex) {
        hex = this.formatHex(hex);

        var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result ? {
            r: parseInt(result[1], 16),
            g: parseInt(result[2], 16),
            b: parseInt(result[3], 16)
        } : null;
    },
    
    rgbToHex: function (r, g, b) {
        return ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
    },
    
    formatHex: function (hex) {
        // Expand shorthand form (e.g. "03F") to full form (e.g. "0033FF")
        var shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
        hex = hex.replace(shorthandRegex, function(m, r, g, b) {
            return r + r + g + g + b + b;
        });
        
        return hex.toLowerCase();
    },
    
    addHexColor: function (c1, c2) {
        var hexStr = (parseInt(c1, 16) + parseInt(c2, 16)).toString(16);
        while (hexStr.length < 6) { hexStr = '0' + hexStr; } // Zero pad.
        
        return hexStr;
    },
    
    subHexColor: function (c1, c2) {
        var hexStr = (parseInt(c1, 16) - parseInt(c2, 16)).toString(16);
        while (hexStr.length < 6) { hexStr = '0' + hexStr; } // Zero pad.
        
        return hexStr;
    },
    
    updateColorPreview: function () {
        $('#color-preview').removeClass('no-color').css({backgroundColor: '#' + this.colorHex});
        
        //        RBG
        $('#similar-preview-1').removeClass('no-color').css({backgroundColor: '#' + this.rgbToHex(this.colorR, this.colorB, this.colorG) });

        //        GRB
        $('#similar-preview-2').removeClass('no-color').css({backgroundColor: '#' + this.rgbToHex(this.colorG, this.colorR, this.colorB) });

        //        GBR
        $('#similar-preview-3').removeClass('no-color').css({backgroundColor: '#' + this.rgbToHex(this.colorG, this.colorB, this.colorR) });

        //        BRG
        $('#similar-preview-4').removeClass('no-color').css({backgroundColor: '#' + this.rgbToHex(this.colorB, this.colorR, this.colorG) });
        
        //        BGR
        $('#similar-preview-5').removeClass('no-color').css({backgroundColor: '#' + this.rgbToHex(this.colorB, this.colorG, this.colorR) });
    },
    
    updateShadings: function () {
        var original = parseInt(this.colorHex, 16);
        
        var shadings = [];
        
        var currentR = this.colorR;
        var currentG = this.colorG;
        var currentB = this.colorB;
        
        while (0 <= currentR && 0 <= currentG && 0 <= currentB) {
            var currentShading = {
                hex: this.rgbToHex(currentR, currentG, currentB),
                r: currentR,
                g: currentG,
                b: currentB
            };
            shadings.push(currentShading);
            
            currentR = currentR - this.colorIncrement;
            currentG = currentG - this.colorIncrement;
            currentB = currentB - this.colorIncrement;
        } 
        
        shadings.reverse();
        
        currentR = this.colorR + this.colorIncrement;
        currentG = this.colorG + this.colorIncrement;
        currentB = this.colorB + this.colorIncrement;
        
        while (255 >= currentR && 255 >= currentG && 255 >= currentB) {
            var currentShading = {
                hex: this.rgbToHex(currentR, currentG, currentB),
                r: currentR,
                g: currentG,
                b: currentB
            };
            shadings.push(currentShading);
            
            currentR = currentR + this.colorIncrement;
            currentG = currentG + this.colorIncrement;
            currentB = currentB + this.colorIncrement;
        } 
        
        $('#color-shadings tbody').empty();
        
        for (var i = 0; i < shadings.length; i++) {
            var shading = shadings[i];
            var html = '';
            
            html += '<tr>';
            html += '   <td class="">';
            html += '       <div class="' + (this.colorHex == shading.hex ? 'shading-preview-current' : 'shading-preview') + '" style="background-color: #' + shading.hex.toString(16) + '">';
            html += '           <input type="hidden" name="shading-hex[' + i + ']" value="' + shading.hex + '" />';
            html += '       </div>';
            html += '   </td>';
            html += '/<tr>';
            
            $('#color-shadings tbody').append(html);
        }
    }
}