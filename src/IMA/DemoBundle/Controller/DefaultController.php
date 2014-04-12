<?php

namespace IMA\DemoBundle\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\Controller;

class DefaultController extends Controller
{
    public function indexAction()
    {
        return $this->render('IMADemoBundle:Default:index.html.twig');
    }

    public function example1Action()
    {
        return $this->render('IMADemoBundle:Example1:index.html.twig');
    }

    public function webstarterAction()
    {
        return $this->render('IMADemoBundle:Webstarter:index.html.twig');
    }
}
