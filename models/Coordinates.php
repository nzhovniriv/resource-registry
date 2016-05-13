<?php
namespace app\models;

use Yii;
use yii\db\ActiveRecord;

class Coordinates extends ActiveRecord
{
	public static function tableName()
	{
		return 'coordinates';
	}

	public function fields()
	{
        return [
            'coord_id',
            'lat',
            'lng',
            'registration_number'
        ];
	}

	public function attributeLabels()
    {
        return [
            'coord_id' => 'Coord ID',
            'lat' => 'Latitude',
            'lng' => 'Longitude',
            'registration_number' => 'Registration Number',
        ];
    }
}
?>