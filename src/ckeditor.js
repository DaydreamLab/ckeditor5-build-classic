/**
 * @license Copyright (c) 2003-2019, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md.
 */

// The editor creator to use.
import ClassicEditorBase from '@ckeditor/ckeditor5-editor-classic/src/classiceditor';

import Essentials from '@ckeditor/ckeditor5-essentials/src/essentials';
import UploadAdapter from '@ckeditor/ckeditor5-adapter-ckfinder/src/uploadadapter';
import Autoformat from '@ckeditor/ckeditor5-autoformat/src/autoformat';
import Bold from '@ckeditor/ckeditor5-basic-styles/src/bold';
import Italic from '@ckeditor/ckeditor5-basic-styles/src/italic';
import BlockQuote from '@ckeditor/ckeditor5-block-quote/src/blockquote';
import CKFinder from '@ckeditor/ckeditor5-ckfinder/src/ckfinder';
import EasyImage from '@ckeditor/ckeditor5-easy-image/src/easyimage';
import Heading from '@ckeditor/ckeditor5-heading/src/heading';
import Image from '@ckeditor/ckeditor5-image/src/image';
import ImageCaption from '@ckeditor/ckeditor5-image/src/imagecaption';
import ImageStyle from '@ckeditor/ckeditor5-image/src/imagestyle';
import ImageToolbar from '@ckeditor/ckeditor5-image/src/imagetoolbar';
import ImageUpload from '@ckeditor/ckeditor5-image/src/imageupload';
import Link from '@ckeditor/ckeditor5-link/src/link';
import List from '@ckeditor/ckeditor5-list/src/list';
import MediaEmbed from '@ckeditor/ckeditor5-media-embed/src/mediaembed';
import Paragraph from '@ckeditor/ckeditor5-paragraph/src/paragraph';
import PasteFromOffice from '@ckeditor/ckeditor5-paste-from-office/src/pastefromoffice';
import Table from '@ckeditor/ckeditor5-table/src/table';
import TableToolbar from '@ckeditor/ckeditor5-table/src/tabletoolbar';

import Plugin from '@ckeditor/ckeditor5-core/src/plugin';
import imageIcon from '@ckeditor/ckeditor5-core/theme/icons/image.svg';
import ButtonView from '@ckeditor/ckeditor5-ui/src/button/buttonview';

import ObservableMixin from '@ckeditor/ckeditor5-utils/src/observablemixin';
import mix from '@ckeditor/ckeditor5-utils/src/mix';

class InsertImage extends Plugin {
	init() {
		const editor = this
			.editor;

		editor.ui.componentFactory.add(
			'insertImage',
			locale => {
				const view = new ButtonView(
					locale
				);

				view.set(
					{
						label:
							'Insert image',
						icon: imageIcon,
						tooltip: true
					}
				);
				// set observables on editor
				editor.set(
					{
						insertImageRequested: false,
						imageFileRequested: null
					}
				);
				// Callback executed once the image is clicked.
				view.on(
					'execute',
					() => {
						// set observable to indicate a request to insert image has been made...
						editor.set(
							{
								insertImageRequested: true
							}
						);
					}
				);
				// Now this waits for the user to have selected a file URL which should show up
				// in the imageFileRequested observable
				editor.on(
					'change:imageFileRequested',
					() => {
						// // Which then injects the image into the body...
						const imageUrl =
							editor.imageFileRequested;
						editor.model.change(
							writer => {
								const imageElement = writer.createElement(
									'image',
									{
										src: imageUrl
									}
								);
								// Insert the image in the current selection location.
								editor.model.insertContent(
									imageElement,
									editor
										.model
										.document
										.selection
								);
							}
						);

						// and unsets our observables back to their original state
						editor.set(
							{
								insertImageRequested: false,
								imageFileRequested: null
							}
						);
					}
				);

				return view;
			}
		);
	}
}
mix( InsertImage, ObservableMixin );

export default class ClassicEditor extends ClassicEditorBase {}

// Plugins to include in the build.
ClassicEditor.builtinPlugins = [
	Essentials,
	UploadAdapter,
	Autoformat,
	Bold,
	Italic,
	BlockQuote,
	CKFinder,
	EasyImage,
	Heading,
	Image,
	ImageCaption,
	ImageStyle,
	ImageToolbar,
	ImageUpload,
	InsertImage,
	Link,
	List,
	MediaEmbed,
	Paragraph,
	PasteFromOffice,
	Table,
	TableToolbar
];

// Editor configuration.
ClassicEditor.defaultConfig = {
	toolbar: {
		items: [
			'heading',
			'|',
			'bold',
			'italic',
			'link',
			'|',
			'bulletedList',
			'numberedList',
			'blockQuote',
			'insertTable',
			'|',
			'mediaEmbed',
			'insertImage',
			'|',
			'undo',
			'redo'
		]
	},
	heading: {
		options: [
			{
				model:
					'paragraph',
				title:
					'Paragraph',
				class:
					'ck-heading_paragraph'
			},
			{
				model:
					'heading1',
				view:
					'h2',
				title:
					'Heading 1',
				class:
					'ck-heading_heading1'
			},
			{
				model:
					'heading2',
				view:
					'h3',
				title:
					'Heading 2',
				class:
					'ck-heading_heading2'
			},
			{
				model:
					'heading3',
				view:
					'h4',
				title:
					'Heading 3',
				class:
					'ck-heading_heading3'
			},
			{
				model:
					'heading4',
				view:
					'h5',
				title:
					'標題 4',
				class:
					'ck-heading_heading4'
			}
		]
	},
	image: {
		toolbar: [
			'imageStyle:full',
			'imageStyle:side',
			'|',
			'imageTextAlternative'
		]
	},
	table: {
		contentToolbar: [
			'tableColumn',
			'tableRow',
			'mergeTableCells'
		]
	},
	// This value must be kept in sync with the language defined in webpack.config.js.
	language:
		'zh'
};
