from PIL import Image
import os
import sys
import argparse

def png_to_imgp_format(png_path, output_path=None):
    """
    Converts a PNG image to your custom image format:
    #define IMG
    RRGGBB RRGGBB ...
    ...
    #end

    Args:
        png_path (str): Path to input PNG file.
        output_path (str): Optional path to save the result as a .txt file.

    Returns:
        str: The formatted image as a string.
    """
    # Load the image
    image = Image.open(png_path).convert("RGB")
    width, height = image.size
    pixels = image.load()

    # Build the formatted output
    lines = ["#define IMG"]
    for y in range(height):
        row = []
        for x in range(width):
            r, g, b = pixels[x, y]
            hex_color = f"{r:02X}{g:02X}{b:02X}"
            row.append(hex_color)
        lines.append(' '.join(row))
    lines.append("#end")

    # Join into a single string
    result = '\n'.join(lines)

    # Optionally write to a file
    if output_path:
        with open(output_path, 'w') as f:
            f.write(result)

    return result

def main():
    parser = argparse.ArgumentParser(description="Convert PNG images to custom .imgp format.")
    parser.add_argument("--image-directory", type=str, required=True, help="Path to directory containing PNG images.")
    parser.add_argument("--output", type=str, help="Optional output file. If a directory is given, each file is saved there with .img extension.")
    parser.add_argument("--print", type=str, default="false", help="Print the converted result (true/false).")

    args = parser.parse_args()
    input_dir = args.image_directory
    output = args.output
    do_print = args.print.lower() == "true"

    if not os.path.isdir(input_dir):
        print(f"Error: '{input_dir}' is not a valid directory.")
        sys.exit(1)

    for filename in os.listdir(input_dir):
        if filename.lower().endswith(".png"):
            input_path = os.path.join(input_dir, filename)
            output_path = None

            if output:
                if os.path.isdir(output):
                    output_filename = os.path.splitext(filename)[0] + ".img"
                    output_path = os.path.join(output, output_filename)
                else:
                    output_path = output

            formatted = png_to_imgp_format(input_path, output_path)
            if do_print:
                print(f"\n== {filename} ==\n{formatted[:500]}")

if __name__ == "__main__":
    main()