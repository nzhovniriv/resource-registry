<?php
namespace app\controllers;
use yii\rest\ActiveController;
use yii\data\ActiveDataProvider;
use app\models\Resource;
use app\models\PersonalData;
use app\models\ResourceClass;
use app\models\Parameter;
use app\models\ResourceAttribute;
use app\models\Coordinates;
class ResourceController extends ActiveController
{
	public $modelClass = 'app\models\Resource';
	public $serializer = [ 'class' => 'yii\rest\Serializer', 'collectionEnvelope' => 'items'];


	public function actionSearch()
	{
		$get = \Yii::$app->request->get();
		$model = new $this->modelClass;
		$query = $model::find();

		$query->andFilterWhere(['like', 'name', $get['name']]);
		$query->andFilterWhere(['like', 'class_id', $get['class_id']]);
		$dataProvider = new ActiveDataProvider([
			'query' => $query,
			'pagination' => [
				'pageSize' => 4,
			],
		]);

		return $dataProvider;
	}

	public function actionGetregisterkey()
	{
		$get = \Yii::$app->request->get();
		$model = new $this->modelClass;
		$query = $model::find();

		$query->andFilterWhere(['registrar_data_id' => $get['registrar_data_id']]);
		$query->orderBy('registration_number DESC')->one();

		$dataProvider = new ActiveDataProvider([
			'query' => $query,
			'pagination' => [
				'pageSize' => 1,
			],
		]);

		return $dataProvider;
	}

	public function actionExport($id)
	{
		$templateFilepath = dirname(__FILE__) . '/../runtime/templates/Template.docx';
		$source = dirname(__FILE__) . '/../runtime/temp.docx';

		\PhpOffice\PhpWord\Autoloader::register();

		$templateProcessor = new \PhpOffice\PhpWord\TemplateProcessor($templateFilepath);

		$months = ['Січня', 'Лютого', 'Березня', 'Квітня',
			'Травня', 'Червня', 'Липня', 'Серпня', 'Вересня',
			'Жовтня', 'Листопада', 'Грудня'];
		$date = getdate();

		$currentDate = $date['mday'] . ' ' . $months[$date['mon'] - 1] . ' ' . $date['year'] . ' року';

		$extractNumber = '№' . $date['mday'] . ($date['mon'] - 1) . substr($date['year'], -2);

		$templateProcessor->setValue('date', $currentDate);
		$templateProcessor->setValue('number', $extractNumber);
		$templateProcessor->saveAs($source);

		$phpWord = \PhpOffice\PhpWord\IOFactory::load($source);

		$phpWord->setDefaultFontName('Times New Roman');
		$phpWord->setDefaultFontSize(11);

		$sectionStyle = [
			'marginTop' => 1000
		];
		$tableStyle = [
			'borderSize' => 6,
			'borderColor' => '000',
			'cellMargin' => 0,
		];
		$innerTableStyle = [
			'cellMargin' => 20,
		];
		$boldFontStyle = ['bold' => true];
		$italicFontStyle = ['italic' => true];
		$styleCell = ['valign' => 'center'];
		$styleCellBTLR = ['valign' => 'center', 'textDirection' => \PhpOffice\PhpWord\Style\Cell::TEXT_DIR_BTLR];
		$innerTableCellStyle = [
			'borderRightSize' => 6,
			'borderRightColor' => '000',
			'borderLeftSize' => 6,
			'borderLeftColor' => '000',
			'borderBottomSize' => 6,
			'borderBottomColor' => '000'
		];
		$innerTableRightCellStyle = [
			'borderLeftSize' => 6,
			'borderLeftColor' => '000',
			'borderBottomSize' => 6,
			'borderBottomColor' => '000'
		];
		$innerTableFontStyle = [
			'size' => 9
		];
		$innerTableParagraphStyle = [
			'align' => 'center'
		];

		$resource = Resource::findOne($id);

		$filename = $resource->name. '.docx';

		$coordinates = json_decode($resource->coordinates);

		$owner_name = 'народ України (Український народ)';

		$resource_class = 'природний ресурс';
		$resource_subclass = ResourceClass::findOne($resource->class_id)->name;
		$creation_date = $resource->date;

		$registrar = PersonalData::findOne($resource->registrar_data_id);
		$registrar_info = $registrar->last_name . ' ' .
		    $registrar->first_name . ' ' . $registrar->middle_name. ' ' .
		    $registrar->address;
		$registrar_shortname =  $registrar->last_name . ' ' .
		    $registrar->first_name . ' ' . $registrar->middle_name. ' ';
		$registration_number = $resource->registration_number;

		$parameters = Parameter::find()
			->where(['resource_id' => $id])
			->all();

		$attributes = [];

		foreach ($parameters as $parameter) {
			$parameter_name = ResourceAttribute::findOne($parameter->attribute_id);
			$attributes[$parameter_name->name] = $parameter->value;
		}

		$length = $attributes['length'];
		$width = $attributes['width'];
		$height = $attributes['height'];

		if ($length || $width || $height) {
			if (!$length) {
				$length = '0';
			}
			if (!$width) {
				$width = '0';
			}
			if (!$height) {
				$height = '0';
			}
			$attributes['linear_size'] = $length . ':' . $width . ':' . $height;
		}

		$reason = $resource->reason;

		function formatCoords($num)
		{
			$num = round($num, 4, PHP_ROUND_HALF_DOWN);
			$degrees = floor($num);
			$minfloat = ($num - $degrees) * 60;
			$minutes = floor($minfloat);
			$secfloat = ($minfloat - $minutes) * 60;
			$seconds = round($secfloat);
			if ($seconds == 60) {
				$minutes++;
				$seconds = 0;
			}
			if ($minutes == 60) {
				$degrees++;
				$minutes = 0;
			}

			return (string)$degrees . '°' . (string)$minutes . '\'' . (string)$seconds . '"';
		}

		$tableFields = [
			'Найменування об’єкту' => $resource->name,
			'Клас об’єкту' => $resource_class,
			'Підклас об’єкту' => $resource_subclass,
			'Власник об’єкту' => $owner_name,
			'Географічні координати кутів (вершин) об’єкту у форматі ГГ°ММ\'СС,СС". ' => $coordinates,
			'Лінійні розміри об’єкту, Д:Ш:В, м' => $attributes['linear_size'] ? $attributes['linear_size'] . ' м' : '',
			'Загальна площа об’єкту, га' => $attributes['square'] ? ($attributes['square'] / 10000) . ' га' : '',
			'Маса (вага) об’єкту, кг' => $attributes['weight'] ? ($attributes['weight'] . ' кг') : '',
			'Периметр об’єкту, м' => $attributes['perimeter'] ? $attributes['perimeter'] . ' м' : '',
			'Об’єм об’єкту, м3' => $attributes['volume'] ? $attributes['volume'] . ' м³' : '',
			'Підстава для внесення відомостей до Реєстру' =>  $reason,
			'ПІБ та поштова адреса народного реєстратора' => $registrar_info,
			'Реєстраційний номер об’єкту' => $registration_number,
			'Дата створення запису' => $creation_date ? str_replace('-', '.', $creation_date) . ' року' : '',
		];
		$tableUnitalicFields = [
			'Клас об’єкту',
			'Власник об’єкту'
		];

		$sections = $phpWord->getSections();
		$section = $sections[0];

		$phpWord->addTableStyle('Resource Table', $tableStyle);
		$table = $section->addTable('Resource Table');

		foreach ($tableFields as $key => $value) {
			if ($value) {
				if (!is_array($value)) {
					$valueFontStyle = [];
					if (in_array($key, $tableUnitalicFields)) {
						$valueFontStyle = $italicFontStyle;
					}
					$table->addRow(200);
					$table->addCell(\PhpOffice\PhpWord\Shared\Converter::cmToTwip(8))
						->addText(htmlspecialchars($key, ENT_COMPAT, 'UTF-8'), $boldFontStyle);
					$table->addCell(\PhpOffice\PhpWord\Shared\Converter::cmToTwip(15))
						->addText(htmlspecialchars($value, ENT_COMPAT, 'UTF-8'), $valueFontStyle);
				} else {
					$row = $table->addRow();
					$row->addCell(\PhpOffice\PhpWord\Shared\Converter::cmToTwip(8))
						->addText(htmlspecialchars($key, ENT_COMPAT, 'UTF-8'), $boldFontStyle);
					$cell = $row->addCell();
					$innerTable = $cell->addTable($innerTableStyle);

					$innerTable->addRow(10);
					$innerTable->addCell(\PhpOffice\PhpWord\Shared\Converter::cmToTwip(4), $innerTableCellStyle)
						->addText(htmlspecialchars('Північна широта', ENT_COMPAT, 'UTF-8'), $innerTableFontStyle, $innerTableParagraphStyle);
					$innerTable->addCell(\PhpOffice\PhpWord\Shared\Converter::cmToTwip(4), $innerTableCellStyle)
						->addText(htmlspecialchars('Східна довгота', ENT_COMPAT, 'UTF-8'), $innerTableFontStyle, $innerTableParagraphStyle);
					$innerTable->addCell(\PhpOffice\PhpWord\Shared\Converter::cmToTwip(4), $innerTableCellStyle)
						->addText(htmlspecialchars("Північна широта \n(продовження)", ENT_COMPAT, 'UTF-8'), $innerTableFontStyle, $innerTableParagraphStyle);
					$innerTable->addCell(\PhpOffice\PhpWord\Shared\Converter::cmToTwip(4), $innerTableRightCellStyle)
						->addText(htmlspecialchars("Східна довгота \n(продовження)", ENT_COMPAT, 'UTF-8'), $innerTableFontStyle, $innerTableParagraphStyle);

					$coordinatesNumber = count($coordinates);
					for ($i=1; $i <= round($coordinatesNumber / 2); $i++)
					{
						$lat = '';
						$lng = '';
						$latCont = '';
						$lngCont = '';
						if ($coordinatesNumber >= $i)
						{
							$lat = formatCoords($coordinates[$i - 1][0]);
							$lng = formatCoords($coordinates[$i - 1][1]);
						}
						if ($coordinatesNumber >= (round($coordinatesNumber / 2) + $i))
						{
							$latCont = formatCoords($coordinates[$i + round($coordinatesNumber / 2) - 1][0]);
							$lngCont = formatCoords($coordinates[$i + round($coordinatesNumber / 2) - 1][1]);
						}
						$innerTable->addRow(10);
						$innerTable->addCell(\PhpOffice\PhpWord\Shared\Converter::cmToTwip(4), $innerTableCellStyle)
							->addText(htmlspecialchars($lat, ENT_COMPAT, 'UTF-8'), $italicFontStyle);
						$innerTable->addCell(\PhpOffice\PhpWord\Shared\Converter::cmToTwip(4), $innerTableCellStyle)
							->addText(htmlspecialchars($lng, ENT_COMPAT, 'UTF-8'), $italicFontStyle);
						$innerTable->addCell(\PhpOffice\PhpWord\Shared\Converter::cmToTwip(4), $innerTableCellStyle)
							->addText(htmlspecialchars($latCont, ENT_COMPAT, 'UTF-8'), $italicFontStyle);
						$innerTable->addCell(\PhpOffice\PhpWord\Shared\Converter::cmToTwip(4), $innerTableRightCellStyle)
							->addText(htmlspecialchars($lngCont, ENT_COMPAT, 'UTF-8'), $italicFontStyle);
					}
				}
			}
		}


		$section->addTextBreak(2);
		$section->addText('Народний реєстратор', $boldFontStyle);
		$section->addText(htmlspecialchars($registrar_shortname, ENT_COMPAT, 'UTF-8'));

		header("Content-Description: File Transfer");
		header('Content-Disposition: attachment; filename="' . $filename . '"');
		header('Content-Type: application/vnd.openxmlformats-officedocument.wordprocessingml.document');
		header('Content-Transfer-Encoding: binary');
		header('Cache-Control: must-revalidate, post-check=0, pre-check=0');
		header('Expires: 0');
		$xmlWriter = \PhpOffice\PhpWord\IOFactory::createWriter($phpWord, 'Word2007');
		$xmlWriter->save("php://output");
	}


	public function checkAccess($action, $model = null, $params = [])
	{
		\Yii::$app->authcomponent->checkPermissions($action,\Yii::$app->authcomponent->write);
	}

	public function actionAdditiondate() {
		//$request= \Yii::$app->request->get();
		//return $request['coord'][5];
		$json_data = "[[49.837110740852815,24.012501686811447],[49.83668517739605,24.013724774122235],[49.8366609582249,24.013821333646774],[49.836650578576425,24.01390716433525],[49.83699310580031,24.014620631933212],[49.83704154379776,24.01465281844139],[49.83710036130087,24.01466891169548],[49.837169558271775,24.01466891169548],[49.837249134665896,24.01467427611351],[49.83731833142388,24.01467427611351],[49.83740136740278,24.01466891169548],[49.837487863062485,24.01465281844139],[49.83754668002271,24.014620631933212],[49.837619336168906,24.014561623334885],[49.83768507258808,24.014502614736557],[49.83772659028046,24.01440069079399],[49.837768107937194,24.014239758253098],[49.83778194714817,24.014111012220383],[49.83777502754318,24.01395007967949],[49.83775772852634,24.013842791318893],[49.83773005008655,24.01370331645012],[49.83763663523526,24.01346728205681],[49.83737368875899,24.012791365385056],[49.83718331656395,24.012319967150685],[150]]";
		$data = json_decode($json_data);
		for($i = 0; $i < count($data) - 1; $i++){
			$coord = new Coordinates();
			$coord->lat = $data[$i][0];
			$coord->lng = $data[$i][1];
			$coord->resource_id = $data[count($data) - 1][0];
			$coord->save();
		}
	}
}