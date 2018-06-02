# csmd-converter
A node js library to convert comic script markdown to other formats

## Install


## Usage



# Markdown Guide

The following keys and syntax are used to generate a comic stript using a modified markdown.

## Title Page

The title page does not use markdown syntax and instead reads the starting characters of each line. If the line starts with the following characters, then the corosponding information will be written to the title page of the sctipt. Any of these keys that appear after the first page indicater, the "#" sysmbol, will be treated as normal script text.

The followign sections outline each key that can be placed in the title page.

### TITLE
The title of the script. This can be an indivisual issue, or a series title if used in conjunction wiht the Issue keys. The title is always printed at the top of the title page, and in an increaded font size

### ISSUE
This is the issue number.

### ISSUE TITLE
The Issue title if one exists.

### CREDIT
You may include a specific type of credit, such as "Art," or "Lettering." This field is meant to be used in conjunction with the "AUTHOR" key. You may include as many of these key pairs as you need. It is expected that there will be a limitued number of these pairs. Havign too many keys will cause the title page to expand beyond the first page.

### AUTHOR
Can be used stand alone, or with the "CREDIT" key. The text in this key will be proceded with the text "by "

### DRAFT DATE
THis key add the current date as the draft date.

### CONTACT
Typically an email address.

### SCRIPT DESCRIPTION
AN optional one or two sentences that describe the script, This could be the stry sentence, or premise.

### Example
Title: SERIES TITLE
Issue Title: Issue 1 - Title
Author: Will Strye
Script Description: A 20 page comic about stuff.
Draft Date: Draft 1 [This text will not show on the title page.]
Contact: foo@bar.fake


## Script Markdown

This is the markdown used for the various script elemnts. Unless otherwise noted all symboles are expected at the start of the line.

### Page Header

Symbol: #
This indicates a new comic page. It inserts a page break and adds a header to the new page, "Page X" where "X" is the current page number. You may place text after the symbol, but it will be ignored in the final script. Page numbers will be generated based on actual content.

### Panel Header

Symbol: ##
This indicates a new comic panel. It creates a line of text for the panel header, "Panel X" where "X" is the current panel number. You may place text after the symbol, but it will be ignored in the final script. Panel numbers will be generated based on actual content.

### Character Names

Symbol: >
Any text on a line starting with the ">" symbol will be treated as the character or dialog name. This will also enter the script generator into dialog mode until an empty line is encountered in teh script.

### Dialog
Any line encountered while in dialog mode will be written as character or caption dialog.

### Dialog Continuations

Symbol: (
All text on a line startign with the "(" symbol will be formated as a continuation marker within the dialog. While it is expected that the parentheticals will look like "(cont)", there are no rules governing this. You can just as easlily write "(gobblyguk)," and the program will format the line like a dialog continuation marker. Please note this symbol is only in effect while in dialog mode 

### Lettering Notes

Symbol: >>
Doubling the right angle brackets while in dialog mode will format the line as a note to the letterer. It will also add the text "Note: " to the front of the line

### Artist note (Aside)

Symbol: <<
Starting a line wit double left angle brackets will write the line as a script note. These mahy be notes to the artist or editor, and are intended to covey extra information that may not fit in the panel or page description. Asides will be formated like normal text, but will be called out with bold italics and in a differnt color.

### Panel and Page descriptions

Any regular text not associated with another set of markdown will be generated as is.


### Personal notes

Symbol: //
Extended Symbol Start: /*
Extended Symbol End: */

These are comments for the writter that will not be printed in the script. A line starting with "//" will not print the line, and will treat subsequent lines as normal. A line starting with "/*" will enter the converter into comment mode, and all lines that follow will be ignored until a line ending with "*/" is encountered. Please not that if the closing symbols need to be the last characters on the line, and have no other text following.


 
